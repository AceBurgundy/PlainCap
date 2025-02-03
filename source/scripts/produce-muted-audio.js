/**
 * Produces a muted audio
 * @return {Promise<MediaStream>}
 */
export default async function() {
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.0;
  gainNode.connect(destination);
  const stream = destination.stream;
  return Object.assign(stream, {getAudioTracks: () => []});
}
