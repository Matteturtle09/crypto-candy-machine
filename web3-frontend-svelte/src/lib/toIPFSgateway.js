export default function toIPFSgateway(urlIpfs) {
  let urlGateway = urlIpfs.replace("ipfs://", "https://ipfs.io/ipfs/");
  return urlGateway;
}
