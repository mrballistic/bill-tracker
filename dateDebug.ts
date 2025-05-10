const dates = [
  '2025-03-05',
  '2025-04-01', 
  '2025-05-01',
  '2025-05-10',
  '2025-05-15'  
];

dates.forEach(dateStr => {
  const date = new Date(dateStr);
  console.log(`String: ${dateStr}, Date: ${date.toISOString()}, Month: ${date.getMonth()}, Year: ${date.getFullYear()}`);
});
