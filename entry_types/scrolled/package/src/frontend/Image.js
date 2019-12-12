import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.css';

export default function Image(props) {
  const awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-images/';

  const wasser = awsBucket + 'wasser.jpg';
  const fisch = awsBucket+'fisch.jpg';
  const schildkroete = awsBucket+'schildkroete.jpg';
  const boot = awsBucket+'boot.jpg';
  const darkPattern = awsBucket+'darkPattern.jpg';
  const lightPattern = awsBucket+'lightPattern.jpg';

  const turm = awsBucket+'turm.jpg';
  const wegweiser = awsBucket+'wegweiser.jpg';
  const wanderromantik = awsBucket+'wanderromantik.jpg';
  const wandervoegel = awsBucket+'wandervoegel.jpg';
  const werkzeuge = awsBucket+'werkzeuge.jpg';
  const schleifstein = awsBucket+'schleifstein.jpg';
  const person = awsBucket+'person.jpg';
  const tool1 = awsBucket+'tool1.jpg';
  const tool2 = awsBucket+'tool2.jpg';
  const tool3 = awsBucket+'tool3.jpg';

  const brandung = awsBucket+'brandung.jpg';
  const strand = awsBucket+'strand.jpg';
  const strandDrohne = awsBucket+'strandDrohne.jpg';
  const strandTouristen = awsBucket+'strandTouristen.jpg';

  const braunkohleBackground1 = awsBucket+'braunkohle/hintergrund1.jpeg';
  const braunkohleBackground2 = awsBucket+'braunkohle/hintergrund2.jpeg';
  const braunkohleInline1 = awsBucket+'braunkohle/inline1.jpeg';
  const braunkohleInline2 = awsBucket+'braunkohle/inline2.jpeg';
  const braunkohleInline3 = awsBucket+'braunkohle/inline3.jpeg';
  const braunkohleInline4 = awsBucket+'braunkohle/inline1.jpeg'
  const braunkohleInline5 = awsBucket+'braunkohle/inline3.jpeg'
  const braunkohleSticky1 = awsBucket+'braunkohle/sticky1.jpeg';
  const braunkohleSticky2 = awsBucket+'braunkohle/sticky2.jpeg';
  const braunkohleSticky3 = awsBucket+'braunkohle/sticky3.jpeg';
  const braunkohleBaggerSelfie = awsBucket+'braunkohle/baggerselfie.jpg';

  /* before/after example images */
  const haldernChurch1 = awsBucket+'before_after/haldern_church1.jpg';
  const haldernChurch2 = awsBucket+'before_after/haldern_church2.jpg';

  const presentationScrollmation1Desktop = awsBucket+'scrollmation/desktop/1.jpg';
  const presentationScrollmation2Desktop = awsBucket+'scrollmation/desktop/2.jpg';
  const presentationScrollmation3Desktop = awsBucket+'scrollmation/desktop/3.jpg';
  const presentationScrollmation1Mobile = awsBucket+'scrollmation/mobile/1.jpg';
  const presentationScrollmation2Mobile = awsBucket+'scrollmation/mobile/2.jpg';
  const presentationScrollmation3Mobile = awsBucket+'scrollmation/mobile/3.jpg';

  const presentationFeedbackBg = awsBucket+'beton-mauer_fragezeichen.jpg';

  const imageUrl = {
    wasser,
    fisch,
    schildkroete,
    boot,
    brandung,
    strand,
    strandDrohne,
    strandTouristen,
    darkPattern,
    lightPattern,
    turm,
    wegweiser,
    wanderromantik,
    wandervoegel,
    werkzeuge,
    schleifstein,
    person,
    tool1,
    tool2,
    tool3,
    haldernChurch1,
    haldernChurch2,
    braunkohleBackground1,
    braunkohleInline1,
    braunkohleInline2,
    braunkohleInline3,
    braunkohleInline4,
    braunkohleInline5,
    braunkohleBackground2,
    braunkohleSticky1,
    braunkohleSticky2,
    braunkohleSticky3,
    braunkohleBaggerSelfie,
    presentationScrollmation1Desktop,
    presentationScrollmation2Desktop,
    presentationScrollmation3Desktop,
    presentationScrollmation1Mobile,
    presentationScrollmation2Mobile,
    presentationScrollmation3Mobile,
    presentationFeedbackBg
  }[props.id];

  return (
    <div className={classNames(styles.root,
                               {[styles.portrait]: props.id.indexOf('Mobile') >= 0})}
         style={{
           backgroundImage: `url(${imageUrl})`,
           backgroundPosition: `${props.focusX}% ${props.focusY}%`
         }} />
  )
}

Image.defaultProps = {
  focusX: 50,
  focusY: 50,
};
