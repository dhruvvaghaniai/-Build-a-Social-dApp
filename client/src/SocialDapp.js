// SocialDapp.js

import { ethers } from 'ethers';
import SocialDappABI from './SocialDapp.json';

const CONTRACT_ADDRESS = '0xE312Af637a03E1C8013D5448d25CB8aAEd3F36e9'; // Replace with actual contract address
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/ff8d23f2b36d4ad1bf4aed9a5b4d1394');

const contract = new ethers.Contract(CONTRACT_ADDRESS, SocialDappABI.abi, provider.getSigner());

export async function createPost(content) {
  const transaction = await contract.createPost(content);
  await transaction.wait();
}

export async function likePost(postId) {
  const transaction = await contract.likePost(postId);
  await transaction.wait();
}

export async function commentOnPost(postId, content) {
  const transaction = await contract.commentOnPost(postId, content);
  await transaction.wait();
}

export async function getPost(postId) {
  return await contract.posts(postId);
}
