import {TextEmbeds} from '../textEmbeds';

import ReactDOMServer from 'react-dom/server';

import {expect} from 'support';

describe('TextEmbeds', () => {
  describe('#renderInString', () => {
    it('replaces placeholders with rendered result of component', () => {
      function GreetingEmbed() {
        return (<em>Hello</em>);
      }

      const textEmbeds = new TextEmbeds(ReactDOMServer);
      textEmbeds.register('greeting', {component: GreetingEmbed});

      const result = textEmbeds.renderInString('<h1>{greeting}</h1>');

      expect(result).to.match(new RegExp('<h1>.*<em .*>Hello</em>.*</h1>'));
    });

    it('supports passing parameters to embed', () => {
      function GreetingEmbed(props) {
        return (<span>Hello {props.name}</span>);
      }

      const textEmbeds = new TextEmbeds(ReactDOMServer);
      textEmbeds.register('greeting', {component: GreetingEmbed});

      const result = textEmbeds.renderInString('<h1>{greeting name="John"}</h1>');

      expect(result).to.match(new RegExp('Hello.*John'));
    });

    it('supports passing multiple parameters', () => {
      function GreetingEmbed(props) {
        return (<span>{props.word} {props.name}</span>);
      }

      const textEmbeds = new TextEmbeds(ReactDOMServer);
      textEmbeds.register('greeting', {component: GreetingEmbed});

      const result = textEmbeds.renderInString('<h1>{greeting word="Hello" name="John"}</h1>');

      expect(result).to.match(new RegExp('Hello.*John'));
    });
  });

  describe('#mountInElement', () => {
    it('hydrates rendered embed component', () => {
      class GreetingEmbed extends React.Component {
        constructor(props) {
          super(props);
          this.state = {mounted: false};
        }

        componentDidMount() {
          this.setState({mounted: true});
        }

        render() {
          return (<span>{this.state.mounted ? 'Mounted': 'Not yet'}</span>);
        }
      }

      const textEmbeds = new TextEmbeds(ReactDOMServer);
      textEmbeds.register('greeting', {component: GreetingEmbed});

      const container = document.createElement('div');
      container.innerHTML = textEmbeds.renderInString('<h1>{greeting}</h1>');
      textEmbeds.mountInElement(container);

      expect(container.innerHTML).to.include('Mounted');
    });

    it('supports passing params', () => {
      class GreetingEmbed extends React.Component {
        constructor(props) {
          super(props);
          this.state = {mounted: false};
        }

        componentDidMount() {
          this.setState({mounted: true});
        }

        render() {
          return (<span>{this.props.name} is {this.state.mounted ? 'mounted': 'not mounted'}</span>);
        }
      }

      const textEmbeds = new TextEmbeds(ReactDOMServer);
      textEmbeds.register('greeting', {component: GreetingEmbed});

      const container = document.createElement('div');
      container.innerHTML = textEmbeds.renderInString('<h1>{greeting name="Component"}</h1>');
      textEmbeds.mountInElement(container);

      expect(container.innerHTML).to.match(/Component.*is.*mounted/);
    });
  });
});
