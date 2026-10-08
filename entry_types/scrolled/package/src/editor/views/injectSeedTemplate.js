import $ from 'jquery';

export function injectSeedTemplate(iframe, name) {
  const doc = iframe.contentDocument || iframe.contentWindow.document;

  doc.open();
  doc.writeln(unescape($(`[data-template="${name}"]`).html()));
  doc.close();
}

function unescape(text) {
  return text.replace(/<\\\//g, '</');
}
