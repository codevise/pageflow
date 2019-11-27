import React from 'react';

export default [
  {
    transition: 'scroll',
    fullHeight: true,
    backdrop: {
      image: 'wasser'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          first: true,
          children: 'Pageflow Next'
        }
      },
      {
        type: 'soundDisclaimer'
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Dies ist der Prototyp von “Pageflow Next” - einer grundlegend überarbeiteten Version des
            bekannten Storytelling-Tools.<br/>
            <br/>
            Im Fokus der Entwicklung standen drei Punkte:<br/>
            <ol>
              <li>Optimale Darstellung auf mobilen Geräten</li>
              <li>Neues User Interface</li>
              <li>
                Wegfall der “Einrastfunktion” am Ende jeder Seite und grundlegend neue
                Darstellungsmöglichkeiten.
              </li>
            </ol>
            Der Prototyp läuft am besten im Chrome-Browser, auf mobilen Geräten mit dem Betriebssystem
            iOS auch in Safari.<br/>
            <br/>
            <b>Was gibt es hier zu sehen?</b>
            <ul>
              <li>
                Die <b>mobile Ausspielung</b> ist der eigentliche Star von “Pageflow Next” - alle
                Funktionen der Desktop-Version funktionieren problemlos auch auf dem Handy und das
                Layout passt sich intelligent an das Hochkantformat an.<br/>
                Zum Testen am besten diese Seite parallel auf Desktop und Mobiltelefon öffnen und
                durchscrollen. Vieles wird auch mit einem auf Handy-Format verkleinerten Browser-Fenster
                sichtbar.
              </li>
              <li>
                Das <b>User Interface</b> ist an verschiedenen Stellen überarbeitet worden. Die
                Navigationsleiste befindet sich jetzt am oberen Rand. Sie enthält Sprungmarken zu den
                Kapiteln des Beitrags. Der horizontale Fortschrittsbalken zeigt dem Leser an welcher
                Stelle des Beitrags er sich gerade befindet. Um möglichst viel Platz für die Story zu
                schaffen, wird die Navigationsleiste eingefahren während man sich durch den Beitrag
                bewegt. Durch die Bewegung des Cursors auf den (immer sichtbaren) Fortschrittsbalken
                (oder durch Scrolling entgegen der Leserichtung) wird die Navigationsleiste wieder
                ausgefahren.
              </li>
              <li>
                Die neuen <b>Darstellungsmöglichkeiten</b> werden auf den folgenden Seiten gezeigt und
                im Text jeweils auch kurz erklärt. Es gibt neue Möglichkeiten für Szenenübergänge,
                Positionierung von Text und Medien und das Layout.
              </li>
            </ul>
            Zum besseren Vergleich gibt es diese Demo-Seiten auch im “alten Pageflow”-Design unter
            folgender Adresse:
            <a href="https://reportage.wdr.de/pageflow-next-lang" target="_blank">
              https://reportage.wdr.de/pageflow-next-lang
            </a> (Benutzername: WDR, Passwort: moreflow)<br/>
            <br/>
            (#1)
          </>
        }
      }
    ]
  },
  {
    transition: 'reveal',
    fullHeight: true,
    appearance: 'transparent',
    backdrop: {
      image: 'boot'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Szenen-Übergänge'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Wie am Übergang der beiden Szenen (Bilder) zu sehen, entfällt in “Pageflow Next” das
            “Einrasten” jeder Seite beim Weiterscrollen. Damit soll sich für den Nutzer der Flow im
            Pageflow verbessern, es soll klarer werden, dass das Ende der Geschichte noch nicht erreicht
            ist.<br/>
            <br/>
            Es gibt verschiedene neue Szenenübergänge und Textformatierungen.<br/>
            <br/>
            <u>Szenenübergang: "Reveal"</u><br/>
            Dieser Szenenübergang legt die nächste Szene frei indem das neue Hintergrundbild
            "aufgedeckt" wird. Der Text scrollt kontinuierlich weiter, womit die Kontinuität des
            Leseflusses beibehalten wird.<br/>
            <br/>
            (#2)
          </>
        }
      }
    ]
  },
  {
    transition: 'scrollOver',
    fullHeight: true,
    appearance: 'cards',
    layout: "center",
    backdrop: {
      image: 'fisch'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            <u>Szenenübergang: "ScrollOver"</u><br/>
            Bei diesem Szenenübergang scrollt das neue Hintergrundbild über das vorherige und bleibt
            dann, sobald es den Viewport ausfüllt, an dieser Position stehen.<br/>
            <br/>
            <u>Positionierung: Zentriert</u><br/>
            Der Begleittext ist in dieser Szene zentriert dargestellt. Diese Option eignet sich
            besonders bei Hintergrundbildern deren Motiv ebenfalls mittig liegt. Neu in “Pageflow Next”:
            Der wichtige Bildteil (in diesem Fall der Fisch) kann markiert werden und wird so zunächst
            nicht von Text verdeckt.<br/>
            <br/>
            <u>Layout:</u> Als Layout kommt hier die Option "Karte" zum Einsatz. Bei dieser Option wird
            der Text mit einer einfarbigen Fläche mit abgerundeten Ecken hinterlegt. Die Option bietet
            maximalen Kontrast und optimale Lesbarkeit und hebt den Text von der Hintergrundebene ab.
            <br/><br/>
            Bei allen gezeigten Layouts sind Variationen denkbar, wie z.B. konfigurierbare Intensität
            der Abdunklung bei Layout "Abdunkeln" Oder Hintergrund- und Textfarbe bei Option "Karte".
            <br/><br/>
            (#3)
          </>
        }
      }
    ]
  },
  {
    transition: 'scrollOver',
    fullHeight: false,
    appearance: 'transparent',
    layout: "left",
    invert: true,
    backdrop: {
      image: '#fff'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Kurze Szenen'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Einzelne Szenen müssen nicht mehr zwingend bildschirmfüllend sein.<br/>
            <br/>
            Durch die neue Scrollmechanik in “Pageflow Next” sind auch Szenen möglich, die nicht den
            ganzen Viewport ausfüllen, sondern eher eine Auflockerung des Leseflusses bieten. Im
            Hintergrund kann ein Bild mit geringer Höhe oder eine einfarbige Fläche liegen.<br/>
            <br/>
            Einsatzmöglichkeiten sind beispielsweise kurze Anmoderationen für Videos oder abgehoben
            dargestellte Zitate.<br/>
            <br/>
            (#4)
          </>
        }
      }
    ]
  },
  {
    transition: 'reveal',
    fullHeight: false,
    appearance: 'transparent',
    layout: "right",
    backdrop: {
      image: 'schildkroete'
    },
    foreground: [{
      type: 'textBlock',
      props: {
        children: <>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </>
      }
    }]
  },
  {
    transition: 'scrollOver',
    fullHeight: false,
    appearance: 'transparent',
    invert: true,
    layout: "right",
    backdrop: {
      image: '#fff'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Hier sind der Kreativität beim Szenenaufbau keine Grenzen gesetzt.<br/>
            <br/>
            Denkbar sind auch mehrere aneinandergereihte kurze Szenen mit verschiedenen Versionen des
            selben Motivs. So lassen sich Overlay-, X-Ray oder Scheiben-Effekte erzielen. Durch
            geschickte Bildauswahl wirken die kurzen Szenen dann wie eine semantisch zusammenhängende
            Szene.<br/>
            <br/>
            Übrigens: Bei Pageflow Next ist rechtsbündig jetzt auch wirklich richtig weit rechts. Das
            war vorher mit der alten Navigation nicht möglich.<br/>
            <br/>
            (#5)
          </>
        }
      }
    ]
  },
  {
    transition: 'scrollOver',
    fullHeight: false,
    appearance: 'cards',
    layout: "left",
    backdrop: {
      image: 'strandTouristen'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Hintergrundbilder können auch ganz ohne Scroll-Animation einfach passend zum Kontext
            ausgetauscht werden.<br/>
            <br/>
            Bei solchen sogenannten "Fade"-Szenenübergängen wird von einem Hintergrundbild zum anderen
            überblendet.<br/>
            <br/>
            (#6)
          </>
        }
      }
    ]
  },
  {
    transition: 'fadeBg',
    fullHeight: false,
    appearance: 'cards',
    layout: "right",
    backdrop: {
      image: 'strandDrohne'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Dabei lassen sich interessante Effekte erzielen indem der Content beider Szenen lesbar ist
            und je nach Scrollposition das eine oder das andere Hintergrundbild verwendet wird.<br/>
            <br/>
            (#7)
          </>
        }
      }
    ]
  },
  {
    transition: 'reveal',
    fullHeight: true,
    appearance: 'shadow',
    layout: "right",
    backdrop: {
      image: 'videoGarzweilerLoop1'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Einsatz von Medien'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Selbstverständlich sind auch Hintergrundvideos/Loops in Pageflow Next wieder möglich.<br/>
            <br/>
            Video mit O-Tönen etc. können nahtlos anschließen und starten automatisch.<br/>
            <br/>
            (#8)
          </>
        }
      }
    ]
  },
  {
    transition: 'scroll',
    fullHeight: false,
    appearance: 'transparent',
    layout: "right",
    backdrop: {
      image: '#000'
    },
    foreground: [
      {
        type: 'inlineVideo',
        position: 'full',
        props: {
          id: 'videoInselInterviewToni',
          autoplay: true,
          controls: true
        }
      }
    ]
  },
  {
    transition: 'scroll',
    fullHeight: true,
    appearance: 'shadow',
    layout: "right",
    backdrop: {
      image: 'braunkohleBackground1'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Inline-Medien'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Medien können nicht nur bildschirmfüllend im Hintergrund platziert werden, sondern auch
            "inline" im Vordergrund. Beispielsweise können Fotos in den Fließtext integriert werden.
          </>
        }
      },
      {
        type: 'inlineImage',
        props: {
          id: 'braunkohleInline1',
          caption: 'Dies ist ein Inline-Bild mit Bild-Unterschrift',
          focusX: 12,
          focusY: 90
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Hier zu sehen ist auch eine neue rechtsbündige Formatierung. Bisher steht rechtsbündig
            formatierter Text oft eher in der Mitte des Bildes, weil der rechte Rand durch die
            Navigation belegt ist.<br/>
            <br/>
            Auch Videos können “inline” ablaufen.
          </>
        }
      },
      {
        type: 'inlineVideo',
        props: {
          id: 'videoGarzweilerDrohne',
          autoplay: true,
          controls: true
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Die Inline-Video-Funktion soll die Möglichkeit bieten auch Videos zu verwenden, die
            qualitativ nicht für eine Vollbildausspielung geeignet sind.
            Beispielsweise historisches Archivmaterial.<br/>
            <br/>
            (#9)
          </>
        }
      }
    ]
  },
  {
    transition: 'fadeBg',
    fullHeight: true,
    appearance: 'shadow',
    layout: "right",
    backdrop: {
      image: 'braunkohleBackground2'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Weiterhin ist es in Pageflow Next möglich, Medien nicht nur inline im Textfluss zu
            positionieren, sondern auch begleitend neben dem Text.
          </>
        }
      },
      {
        type: 'stickyImage',
        props: {
          id: 'braunkohleSticky1',
          caption: 'Dies ist ein sticky image',
          focusX: 12,
          focusY: 90
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Das Element bleibt dann so lange statisch an seiner Position neben dem Text stehen, bis
            entweder die Szene aus dem Viewport gescrollt wird oder es vom nächsten begleitenden Element
            verdrängt wird.<br/>
            Diese Positionierung wird im Gegensatz zu inline "sticky" genannt.
          </>
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            In Mobildarstellung werden sticky images einfach zu inline images. Auf diese Weise kann das
            Erscheinungsbild aufgelockert werden und dabei trotzdem verschiedenen Screengrößen optimal
            Rechnung getragen werden.<br/>
            <br/>
            (#10)
          </>
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Sticky images funktionieren besonders gut bei Desktop-Darstellung und langen Textpassagen:
          </>
        }
      },
      {
        type: 'loremIpsum3',
        props: {dummy: true}
      },
      {
        type: 'stickyImage',
        props: {
          id: 'braunkohleSticky2'
        }
      },
      {
        type: 'loremIpsum1',
        props: {dummy: true}
      },
      {
        type: 'loremIpsum2',
        props: {dummy: true}
      },
      {
        type: 'loremIpsum3',
        props: {dummy: true}
      },
      {
        type: 'stickyImage',
        props: {
          id: 'braunkohleSticky3'
        }
      },
      {
        type: 'loremIpsum1',
        props: {dummy: true}
      },
      {
        type: 'loremIpsum2',
        props: {dummy: true}
      },
      {
        type: 'loremIpsum3',
        props: {dummy: true}
      }
    ]
  },
  {
    transition: 'scroll',
    fullHeight: true,
    layout: "right",
    backdrop: {
      image: 'braunkohleBaggerSelfie'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: <>
            Lösung für Köpfe
          </>
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Ein Problem der alten Pageflow-Version: Wenn Personen im Bild zu sehen waren, lief der Text
            je nach Auflösung und Gerät, mitten durch deren Gesicht. Das ist jetzt gelöst. Selbst auf
            Smartphones bleibt das Gesicht in diesem Beispiel zunächst sichtbar und wird beim Scrollen
            des Textes erst abgedunkelt und dann vom Text verdeckt.<br/>
            <br/>
            Die Auswahl der Positionierung erfolgt passend zum Hintergrundbild-Motiv. Dazu wird beim
            Upload neuer Bilder grundsätzlich ein Bereich markiert, der das wesentliche Motiv
            umschließt. Bei der Positonierung der scrollenden Vordergrundeben wird dann versucht diesen
            Bereich weitestgehend freizulassen damit er zur Geltung kommen kann.<br/>
            In der Mobildarstellung wird der Text dementsprechend innerhalb der Szene nach unten
            geschoben, während in der Desktop-Darstellung genug Platz ist um das Motiv neben dem Text
            anzuzeigen.<br/>
            <br/>
            (#11)
          </>
        }
      }
    ]
  },
  {
    transition: 'beforeAfter',
    fullHeight: false,
    appearance: 'transparent',
    layout: "center",
    backdrop: {
      image: '#000'
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: <>
            Vorher/Nachher
          </>
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Das beliebte Storytelling-Feature Vorher/Nachher-Vergleichsbild ist selbstverständlich auch
            bereits in Pageflow Next integriert.<br/><br/>
            Der Schieberegler kann durch ziehen oder klicken beweget werden. Neu ist die Möglichkeit der
            Beschriftung der einzelnen Bilder, wobei der Text bei der Bedienung des Schiebreglers
            ausgeblendet wird.<br/>
            <br/>
            Der Vorher/Nachher-Modus muss nicht mehr wie aktuell in Pageflow "aktiviert" bzw.
            "gestartet" werden, sondern lädt durch eine kurze Animation beim Betreten der Szene direkt
            zum Ausprobieren ein.<br/>
            <br/>
            (#12)
          </>
        }
      }
    ]
  },
  {
    transition: 'scroll',
    fullHeight: false,
    appearance: 'transparent',
    layout: "center",
    backdrop: {
      image: '#000',
    },
    foreground: [
      {
        type: 'inlineBeforeAfter',
        position: 'full',
        props: {
          leftImageLabel: 'Hier kann Text zum "Vorher"-Bild angegeben werden',
          rightImageLabel: 'Hier kann Text zum "Nachher"-Bild angegeben werden (#11)',
          slideMode: 'classic',
          startPos: 0.5
        }
      }
    ],
  },
  {
    transition: 'scroll',
    fullHeight: false,
    appearance: 'transparent',
    layout: "center",
    invert: true,
    backdrop: {
      image: '#fff',
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Phasenbilder'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Mit Hilfe der vordefinierten Szenenübergänge lassen sich auch zeitliche Abfolgen simulieren.
            In diesem Beispiel wird ein Schaubild in 3 Schritten passend zum Text aufgedeckt.
          </>
        }
      }
    ],
  },
  {
    transition: 'reveal',
    fullHeight: false,
    layout: "right",
    appearance: 'cards',
    backdrop: {
      image: 'presentationScrollmation1Desktop',
      imageMobile: 'presentationScrollmation1Mobile'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Das Scrollen des Nutzers veranlasst im Hintergrund den Szenenübergang (in diesem
            Fall die Variante "Fade").
          </>
        }
      }
    ],
  },
  {
    transition: 'fadeBg',
    fullHeight: false,
    layout: "right",
    appearance: 'cards',
    backdrop: {
      image: 'presentationScrollmation2Desktop',
      imageMobile: 'presentationScrollmation2Mobile'
    },
    foreground: [
      {
        type: 'textBlock',
        props: {
          children: <>
            Durch die Anfertigung passenden Bildmaterials und die Konfiguration entsprechender
            Szenenübergänge und Positionierungen (achten sie auch hier wieder auf die Mobildarstellung)
            lassen sich so komplexe Abfolgen, Datendiagramme oder zeitliche Veränderungen
            Stück für Stück übertragen. (#13)
          </>
        }
      }
    ],
  },
  {
    transition: 'fadeBg',
    fullHeight: false,
    layout: "right",
    appearance: 'cards',
    backdrop: {
      image: 'presentationScrollmation3Desktop',
      imageMobile: 'presentationScrollmation3Mobile'
    },
    foreground: []
  },
  {
    transition: 'beforeAfter',
    fullHeight: true,
    appearance: 'shadow',
    layout: "left",
    backdrop: {
      image: 'presentationFeedbackBg',
    },
    foreground: [
      {
        type: 'heading',
        props: {
          children: 'Feedback Pageflow Next?'
        }
      },
      {
        type: 'textBlock',
        props: {
          children: <>
            Dieser Prototyp ist in vier einwöchigen Sprints entstanden. Wie bei der agilen
            Softwareentwicklung üblich, haben wir jede Woche neu entschieden welche Ideen wir weiter
            verfolgen wollen und welche Dinge wir niedriger priorisieren.<br/>
            Dieser Prototyp zeigt deswegen wichtige neue Darstellungs- und Bedienmöglichkeiten, aber er
            ist noch kein fertiges Produkt. Die Navigationsleiste haben wir beispielsweise nur
            skizziert, der Prototyp ist nur auf den Chrome-Browser (iOS auch Safari) optimiert und er
            enthält auch noch kein intelligentes Lademanagement für Videos.<br/>
            <br/>
            Wir freuen uns über Feedback! Sind die neuen Mechanismen sinnvoll oder überflüssig? Wie
            fühlt sich Pageflow ohne Einrasten am Seitenende an? Was fehlt? Was ist toll?<br/>
            <br/>
            <a mailto="pageflow@wdr.de">pageflow@wdr.de</a>.
          </>
        }
      }
    ],
  }
]
