import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'quote',
  baseConfiguration: {
    text: [
      {
        type: 'paragraph',
        children: [{text: 'Be the change that you wish to see in the world.'}]
      }
    ],
    attribution: [
      {
        type: 'paragraph',
        children: [{text: 'Mahatma Gandhi'}]
      },
      {
        type: 'paragraph',
        children: [{text: '1869–1948'}]
      }
    ]
  },
  variants: [
    {
      name: 'Large',
      configuration: {
        textSize: 'large'
      }
    },
    {
      name: 'Medium',
      configuration: {
        textSize: 'medium'
      }
    },
    {
      name: 'Small',
      configuration: {
        textSize: 'small'
      }
    },
    {
      name: 'Very Small',
      configuration: {
        textSize: 'verySmall'
      }
    },
    {
      name: 'Large Centered',
      configuration: {
        variant: 'largeCentered-custom'
      },
      themeOptions: {
        properties: {
          'quote-largeCentered-custom': {
            quoteLargeMarkFontSize: '3em'
          }
        }
      }
    },
    {
      name: 'Hanging',
      themeOptions: {
        quoteDesign: 'hanging'
      }
    },
    {
      name: 'Hanging Centered Ragged',
      configuration: {
        text: [
          {
            type: 'paragraph',
            children: [{text: 'Be the change\n that you wish to see in the world'}]
          }
        ]
      },
      themeOptions: {
        quoteDesign: 'hanging'
      },
      sectionConfiguration: {
        layout: 'centerRagged'
      }
    },
    {
      name: 'Hanging with custom spacing',
      themeOptions: {
        quoteDesign: 'hanging',
        properties: {
          root: {
            quoteHangingMarkSpacing: '0.3em'
          }
        }
      }
    },
    {
      name: 'Centered Attribution',
      themeOptions: {
        properties: {
          root: {
            quoteAttributionMinWidth: '50%'
          }
        }
      }
    },
    {
      name: 'Inline',
      themeOptions: {
        quoteDesign: 'inline',
        properties: {
          root: {
            quoteLeftMark: '"»"',
            quoteRightMark: '"«"',
            quoteMarkFontWeight: 'normal',
            quoteIndent: 0,
            quoteMarkOpacity: 1
          }
        }
      }
    },
    {
      name: 'Double angle',
      themeOptions: {
        properties: {
          root: {
            quoteLeftMark: '"»"',
            quoteLeftMarkTop: '-0.35em'
          }
        }
      }
    },
    {
      name: 'SVG mark',
      themeOptions: {
        properties: {
          root: {
            quoteLeftMark: markSvg(),
            quoteLargeMarkFontSize: '1em',
            quoteMarkWidth: '1.5em',
            quoteHangingMarkSpacing: '0.3em',
            quoteIndent: '1.8em',
            quoteLeftMarkTop: '-0.35em'
          }
        }
      }
    },
    {
      name: 'SVG mask mark',
      themeOptions: {
        properties: {
          root: {
            quoteLeftMarkMaskImage: markSvg(),
            quoteMarkColor: 'red',
            quoteLargeMarkFontSize: '1.2em',
            quoteMarkOpacity: '1',
            quoteMarkWidth: '1.25em',
            quoteHangingMarkSpacing: '0.3em',
            quoteIndent: '1.8em',
            quoteLeftMarkTop: '-0.35em'
          }
        }
      }
    },
    {
      name: 'SVG mask mark with palette color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f',
            quoteLeftMarkMaskImage: markSvg(),
            quoteLargeMarkFontSize: '1.2em',
            quoteMarkOpacity: '1',
            quoteMarkWidth: '1.25em',
            quoteHangingMarkSpacing: '0.3em',
            quoteIndent: '1.8em',
            quoteLeftMarkTop: '-0.35em'
          }
        }
      },
      configuration: {
        color: 'accent'
      }
    },
    {
      name: 'Pallete color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f'
          }
        }
      },
      configuration: {
        color: 'accent'
      }
    },
    {
      name: 'Custom attribution font weight',
      themeOptions: {
        properties: {
          root: {
            quoteAttributionFirstLineFontWeight: 'normal'
          }
        }
      }
    }
  ]
});

function markSvg() {
  return `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' shape-rendering='geometricPrecision' text-rendering='geometricPrecision' image-rendering='optimizeQuality' fill-rule='evenodd' clip-rule='evenodd' viewBox='0 0 512 358.88'%3E%3Cpath fill='%230ff' fill-rule='nonzero' d='M383.91 0c42.61 0 74.76 14 96.41 41.99 10.59 13.68 18.53 29.23 23.81 46.63 5.25 17.26 7.87 36.24 7.87 56.9 0 23.45-3.27 45.79-9.81 67.02-6.55 21.24-16.35 41.25-29.38 60.01-13.05 18.77-28.97 35.33-47.76 49.66-18.67 14.24-40.16 26.25-64.44 36.03a8.869 8.869 0 0 1-8.51-1.06l-88.49-56.56c-4.12-2.63-5.33-8.1-2.7-12.21a8.769 8.769 0 0 1 4.06-3.42c16.64-6.98 31.71-14.08 45.19-21.3 13.47-7.22 25.48-14.62 36.02-22.19 10.22-7.34 19.04-15.44 26.45-24.3 2.46-2.93 4.76-5.94 6.9-9.03-4.65 1.45-9.61 2.17-14.88 2.17-13.52 0-26.24-2.13-38.14-6.37-11.93-4.24-22.97-10.61-33.12-19.1-10.43-8.71-18.26-19.37-23.47-31.94-5.12-12.35-7.69-26.44-7.69-42.26 0-18.17 2.7-34.18 8.08-48.01 5.51-14.18 13.82-25.97 24.88-35.33 10.85-9.17 23.79-16.05 38.81-20.61C348.74 2.24 365.38 0 383.91 0zm82.4 52.81c-18.08-23.36-45.55-35.05-82.4-35.05-16.93 0-31.86 1.97-44.78 5.89-12.63 3.84-23.47 9.58-32.49 17.22-8.79 7.44-15.41 16.84-19.82 28.18-4.55 11.69-6.83 25.57-6.83 41.62 0 13.52 2.11 25.35 6.3 35.46 4.11 9.89 10.27 18.28 18.48 25.14 8.49 7.1 17.72 12.43 27.67 15.98 9.95 3.55 20.69 5.33 32.21 5.33 9.05 0 16.67-3.34 22.85-10 3.14-3.34 8.37-3.77 12.01-.87l4.44 3.56c3.17 2.42 4.4 6.78 2.71 10.59-5.25 11.83-12.07 22.74-20.42 32.72-8.32 9.94-18.23 19.04-29.72 27.29-11.16 8.01-23.84 15.83-38.03 23.43-9.78 5.24-20.23 10.36-31.34 15.37l71.04 45.41c21.07-8.85 39.77-19.5 56.1-31.95 17.28-13.18 31.92-28.42 43.94-45.71 12.03-17.31 21.04-35.68 27.02-55.08 5.99-19.43 8.99-40.04 8.99-61.82 0-19.07-2.35-36.33-7.04-51.76-4.64-15.3-11.61-28.96-20.89-40.95zM124.39 0c42.62 0 74.76 14 96.42 41.99 10.58 13.68 18.52 29.23 23.81 46.63 5.24 17.26 7.87 36.24 7.87 56.9 0 47.08-13.07 89.43-39.2 127.03-13.04 18.77-28.97 35.33-47.76 49.66-18.66 14.24-40.15 26.25-64.44 36.03a8.876 8.876 0 0 1-8.51-1.06L4.09 300.62c-4.12-2.63-5.33-8.1-2.7-12.21a8.769 8.769 0 0 1 4.06-3.42c16.64-6.98 31.71-14.08 45.2-21.3 13.47-7.22 25.48-14.62 36.02-22.19 10.21-7.34 19.03-15.44 26.45-24.3 2.47-2.95 4.78-5.98 6.94-9.09-4.71 1.48-9.69 2.23-14.93 2.23-13.54 0-26.27-2.13-38.17-6.37l-.44-.17c-11.76-4.26-22.64-10.57-32.64-18.93-10.43-8.71-18.26-19.37-23.48-31.94-5.12-12.35-7.68-26.44-7.68-42.26 0-18.17 2.69-34.18 8.07-48.01 5.52-14.18 13.82-25.97 24.89-35.33 10.84-9.17 23.78-16.05 38.8-20.61C89.22 2.24 105.87 0 124.39 0zm82.4 52.81c-18.08-23.36-45.54-35.05-82.4-35.05-16.93 0-31.86 1.97-44.77 5.89-12.64 3.84-23.47 9.58-32.49 17.22-8.8 7.44-15.41 16.84-19.82 28.18-4.55 11.69-6.83 25.57-6.83 41.62 0 13.52 2.1 25.35 6.3 35.46 4.1 9.89 10.27 18.28 18.48 25.14 8.4 7.03 17.5 12.31 27.27 15.85l.4.13c9.95 3.55 20.69 5.33 32.2 5.33 4.61 0 8.79-.82 12.51-2.45 3.75-1.64 7.21-4.16 10.35-7.55 3.14-3.34 8.37-3.77 12-.87l4.45 3.56a8.843 8.843 0 0 1 2.71 10.59 138.097 138.097 0 0 1-20.43 32.72c-8.32 9.94-18.23 19.04-29.71 27.29-11.16 8.01-23.85 15.83-38.04 23.43-9.78 5.24-20.22 10.36-31.34 15.37l71.04 45.41c21.07-8.85 39.78-19.5 56.1-31.95 17.28-13.18 31.93-28.42 43.95-45.71 24-34.54 36-73.51 36-116.9 0-19.07-2.34-36.33-7.03-51.76-4.65-15.3-11.62-28.96-20.9-40.95z'/%3E%3C/svg%3E")`;
}
