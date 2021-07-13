import Container from './Container';

export default function(props) {
  return (
    <Container {...props}
               viewBoxLeft={60} viewBoxTop={170}
               viewBoxWidth={90} viewBoxHeight={157}>
      <path
        fill="currentColor"
        d="M 188.97656 744.56641 A 188.97638 188.97638 0 0 0 0 933.54297 A 188.97638 188.97638 0 0 0 188.97656 1122.5195 L 566.92969 1122.5195 A 188.97638 188.97638 0 0 0 755.90625 933.54297 A 188.97638 188.97638 0 0 0 566.92969 744.56641 L 188.97656 744.56641 z "
        transform="scale(0.26458333)"/>
      <circle
        id="path3721-7"
        cx="50"
        cy="247"
        fill="#ffffff"
        r="40" />
      <path
        fillOpacity="0" stroke="#fff" strokeWidth="6"
        d="m 110.10252,271.89748 49.79539,-49.79494" />
      <path
        fillOpacity="0" stroke="#fff" strokeWidth="6"
        d="M 159.89746,271.89748 110.10252,222.10209" />
    </Container>
  );
}
