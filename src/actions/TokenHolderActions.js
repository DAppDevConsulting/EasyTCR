export function challenge (listing) {
  console.log('CHALLENGE action');
  return {
    type: 'CHALLENGE',
    listing
  };
}
