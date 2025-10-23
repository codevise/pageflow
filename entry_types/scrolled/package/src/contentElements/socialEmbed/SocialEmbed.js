import React, { useState, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';

import {
  ContentElementBox,
  ThirdPartyOptIn,
  useContentElementEditorState,
  ThirdPartyOptOutInfo,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

import {loadScript, reloadScript} from './loadScript';
import {defaultProviders} from './providers';

import styles from './SocialEmbed.module.css';

export function SocialEmbed({configuration, providers = defaultProviders}) {
  const {provider: providerName} = configuration;
  const provider = providers.find(p => p.name === providerName);

  if (!provider) {
    return (
      <ContentElementBox>
        <div>
          <p>Please select a provider (X, Instagram, Bluesky, or TikTok).</p>
        </div>
      </ContentElementBox>
    );
  }

  return (
    <SocialEmbedWithProvider
      configuration={configuration}
      provider={provider}
    />
  );
}

function SocialEmbedWithProvider({configuration, provider}) {
  const {url} = configuration;
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();

  const [minHeight, setMinHeight] = useState({});

  const key = [url, JSON.stringify(configuration)].join('-');

  const onLoad = useCallback(({height}) => {
    setMinHeight({[key]: height})
  }, [key]);

  const Placeholder = provider.Placeholder;

  return (
    <ContentElementBox>
      <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        {shouldLoad && url ?
         <ThirdPartyOptIn
           icon={false}
           wrapper={children => <Placeholder>{children}</Placeholder>}>
           <Embed
             key={key}
             provider={provider}
             url={url}
             configuration={configuration}
             minHeight={minHeight[key]}
             onLoad={onLoad}
           />
         </ThirdPartyOptIn> :
         <Placeholder minHeight={minHeight[key]} />}
        <ThirdPartyOptOutInfo />
      </div>
    </ContentElementBox>
  );
}

function Embed({provider, url, configuration, minHeight, onLoad}) {
  const ref = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const Placeholder = provider.Placeholder;

  useEffect(() => {
    let isComponentMounted = true;

    const loadAndProcess = async () => {
      try {
        if (provider.process) {
          await loadScript(provider.embedScript);

          if (isComponentMounted) {
            await provider.process({
              element: ref.current,
              url,
              configuration
            });
          }
        } else {
          await reloadScript(provider.embedScript);
        }

        if (isComponentMounted && provider.ready) {
          await provider.ready({
            element: ref.current
          });
        }

        if (isComponentMounted) {
          setScriptLoaded(true);
          onLoad({height: ref.current?.clientHeight});
        }
      } catch (error) {
        console.error(`Failed to load ${provider.name} embed:`, error);
      }
    };

    loadAndProcess();

    return () => {
      isComponentMounted = false;
    };
  }, [provider, url, configuration, onLoad]);

  return (
    <>
      {!scriptLoaded && <Placeholder minHeight={minHeight} />}
      <div className={classNames(styles.container, {[styles.loadingContainer]: !scriptLoaded})} ref={ref}>
        <provider.Seed  url={url} configuration={configuration} />
      </div>
    </>
  );
}
