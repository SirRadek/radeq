// Explicit sentence boundaries in our own trusted copy; never split arbitrary HTML.
const starts = [
 'Kontakt:', 'Před objednávkou', 'Zálohu, splatnost', 'Neslibuji konkrétní',
 'Zahájení práce', 'Pokud spor', 'Odesláním nevzniká', 'Bez nezbytných',
 'Záložní kopie', 'E-mailové oznámení', 'Neposílám jim', 'Volbu ukládám',
 'Podrobnosti k vašim', 'Pište na',
 'Contact:', 'Before ordering,', 'Deposits, due dates', 'I do not guarantee',
 'Starting work', 'If we cannot resolve', 'An enquiry is not',
 'Without contact details', 'Provider backups', 'Resend sends',
 'I do not send your', 'Your preference is stored', 'You may request details',
 'Write to siroky',
];
export function legalParagraphs(body) {
 const positions=starts.map(start=>body.indexOf(' '+start)).filter(i=>i>=0).sort((a,b)=>a-b);
 let last=0;
 return [...new Set(positions),body.length].map(i=>{
  const paragraph=body.slice(last,i).trim(); last=i;
  return paragraph;
 }).filter(Boolean);
}
