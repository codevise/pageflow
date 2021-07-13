import Container from './Container';

export default function(props) {
  return (
    <Container {...props}
               viewBoxLeft={60} viewBoxTop={170}
               viewBoxWidth={90} viewBoxHeight={157}>
      <path
        fill="currentColor"
        d="m 150.00015,296.99993 a 50,50 0 0 0 50.00004,-50.00005 50,50 0 0 0 -50.00004,-50.00004 H 50.000048 A 50,50 0 0 0 0,246.99988 50,50 0 0 0 50.000048,296.99993 Z" />
      <circle
        cx="-150.0002"
        cy="-246.99979"
        fill="#fff"
        r="40"
        transform="scale(-1)" />
      <path fillOpacity="0" stroke="#fff" strokeWidth="6"
            d="M 87,227 50,264 34,246" />
    </Container>
  );
}
