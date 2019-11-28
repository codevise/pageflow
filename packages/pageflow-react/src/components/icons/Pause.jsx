import Container from './Container';

export default function(props) {
  return (
    <Container {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M162.642 148.337h86.034v215.317h-86.034v-215.316z" />
      <path d="M293.356 148.337h86.002v215.317h-86.002v-215.316z" />
    </Container>
  );
}
