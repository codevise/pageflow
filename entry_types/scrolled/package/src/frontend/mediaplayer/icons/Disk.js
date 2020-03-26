import Container from './Container';

export default function(props) {
  return (
    <Container {...props} viewBoxWidth={24} viewBoxHeight={24}>
      <circle cx="12" cy="12" r="12" />
    </Container>
  );
}
