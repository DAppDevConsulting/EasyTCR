export function challenge (listing, deposit) {
  console.log('CHALLENGE action');
  return {
    type: 'CHALLENGE',
    listing,
    deposit
  };
}
