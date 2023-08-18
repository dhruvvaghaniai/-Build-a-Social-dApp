import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SocialDappABI from './contract/SocialDapp.json'; // Make sure this path is correct
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [postId, setPostId] = useState(0);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [post, setPost] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [postLoaded, setPostLoaded] = useState(false);

  useEffect(() => {
    async function loadProvider() {
      if (window.ethereum) {
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      }
    }
    loadProvider();
  }, []);

  useEffect(() => {
    async function loadContract() {
      if (provider) {
        const signer = provider.getSigner();
        const contractAddress = '0xddbf8D18B4dAb05B66D8A712bA78aD3a7600d31a'; // Replace with your actual contract address
        const socialDappContract = new ethers.Contract(contractAddress, SocialDappABI, signer);
        setContract(socialDappContract);
      }
    }
    loadContract();
  }, [provider]);

  const connectWallet = async () => {
    if (provider) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.listAccounts();
        setWalletAddress(accounts[0]);
        const signer = provider.getSigner();
        const balance = await signer.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('Web3 provider not detected');
    }
  };

  const handleCreatePost = async () => {
    if (contract && content && !loadingCreate) {
      setLoadingCreate(true);
      try {
        const tx = await contract.createPost(content);
        await tx.wait();
        console.log('Post created:', tx.hash);
        setLoadingCreate(false);
      } catch (error) {
        console.error('Error creating post:', error);
        setLoadingCreate(false);
      }
    }
  };

  const handleLikePost = async () => {
    if (contract && postId && !loadingLike) {
      setLoadingLike(true);
      try {
        const tx = await contract.likePost(postId);
        await tx.wait();
        console.log('Post liked:', tx.hash);
        setLoadingLike(false);
      } catch (error) {
        console.error('Error liking post:', error);
        setLoadingLike(false);
      }
    }
  };

  const handleGetPost = async () => {
    if (contract && postId && !loadingGet) {
      setLoadingGet(true);
      try {
        const result = await contract.getPostData(postId);
        // ... (rest of the code to fetch and set post data)
        setLoadingGet(false);
      } catch (error) {
        console.error('Error getting post:', error);
        setLoadingGet(false);
      }
    }
  };

  const handleComment = async () => {
    const commentContent = window.prompt('Enter your comment:');
    if (commentContent && contract && postId && !commenting) { // Check commenting state
      setCommenting(true); // Set commenting state to true
      try {
        const tx = await contract.commentOnPost(postId, commentContent);
        await tx.wait();
        console.log('Comment added:', tx.hash);
        setCommenting(false); // Reset commenting state to false
      } catch (error) {
        console.error('Error adding comment:', error);
        setCommenting(false); // Reset commenting state to false
      }
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Dhruvvaghani Social DApp</h1>
      <div className="wallet-info">
        <button
          className={`connect-button${walletAddress ? ' disabled' : ''}`}
          onClick={connectWallet}
          disabled={walletAddress !== ''}
        >
          {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
          {walletAddress && <div className="spinner"></div>}
        </button>
        {walletAddress && (
          <div className="wallet-details">
            <p>Wallet Address: {walletAddress}</p>
            <p>Balance: {balance} ETH</p>
          </div>
        )}
      </div>
      <div className="post-actions">
        <h2>Create Post</h2>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className={`action-button${loadingCreate ? ' disabled' : ''}`} onClick={handleCreatePost}>
          {loadingCreate ? 'Creating...' : 'Create Post'}
        </button>
      </div>
      <div className="post-actions">
        <h2>Like Post</h2>
        <input
          type="number"
          placeholder="Like"
          onChange={(e) => setPostId(e.target.value)}
        />
        <button className={`action-button${loadingLike ? ' disabled' : ''}`} onClick={handleLikePost}>
          {loadingLike ? 'Liking...' : 'Like Post'}
        </button>
      </div>
      <div className="post-actions">
        <h2>Comment on Post</h2>
        <input
          type="number"
          placeholder="Comment"
          onChange={(e) => setPostId(e.target.value)}
        />
        <button className={`action-button${commenting ? ' disabled' : ''}`} onClick={handleComment}>
          {commenting ? 'Commenting...' : 'Comment'} {/* Update button text */}
        </button>
      </div>
      <div className="get-post">
        <h2>Get Post</h2>
        <input
          type="number"
          placeholder="Post ID"
          onChange={(e) => setPostId(e.target.value)}
        />
        <button className={`action-button${loadingGet ? ' disabled' : ''}`} onClick={handleGetPost}>
          {loadingGet ? 'Loading...' : 'Get Post'}
        </button>
        {post && (
          <div className={`post-details${postLoaded ? ' show' : ''}`}>
            <p>Author: {post.author}</p>
            <p>Content: {post.content}</p>
            <p>Likes: {post.likeCount}</p>
            <h3>Comments:</h3>
            <ul className="comment-list">
              {post.comments.map((comment, index) => (
                <li key={index} className="comment-item">
                  {comment.content}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}


export default App;
