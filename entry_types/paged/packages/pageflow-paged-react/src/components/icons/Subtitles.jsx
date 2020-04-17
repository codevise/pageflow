import Container from './Container';

export default function(props) {
  return (
    <Container {...props} viewBoxWidth={1200} viewBoxHeight={1200}>
      <path transform="translate(100,100)"
            d="M893.4,599V500H401.1V599H893.4z M893.4,794.5v-98.9H695.5v98.9H893.4z M598.9,794.5v-98.9H106.6v98.9H598.9z M106.6,500V599h197.8V500H106.6z M893.4,106.7c26.1,0,48.7,10,67.9,29.9s28.8,42.9,28.8,69v588.9c0,26.1-9.6,49.1-28.8,69c-19.2,19.9-41.8,29.9-67.9,29.9H106.6c-26.1,0-48.7-10-67.9-29.9c-19.2-19.9-28.8-42.9-28.8-69V205.5c0-26.1,9.6-49.1,28.8-69s41.8-29.9,67.9-29.9H893.4z"/>
    </Container>
  );
}
