// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SocialDapp {
    struct Post {
        address author;
        uint256 postId;
        string content;
        uint256 likeCount;
        Comment[] comments;
    }

    struct Comment {
        address commenter;
        string content;
    }

    uint256 public postCounter;
    address public owner;

    mapping(uint256 => Post) public posts;

    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        string content
    );
    event PostLiked(uint256 indexed postId, address indexed liker);
    event CommentAdded(
        uint256 indexed postId,
        address indexed commenter,
        string content
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function createPost(string memory _content) external {
        postCounter++;
        posts[postCounter] = Post(
            msg.sender,
            postCounter,
            _content,
            0,
            new Comment[](0)
        );
        emit PostCreated(postCounter, msg.sender, _content);
    }

    function likePost(uint256 _postId) external {
        require(_postId <= postCounter && _postId > 0, "Invalid post ID");
        Post storage post = posts[_postId];
        require(post.author != address(0), "Post does not exist");

        post.likeCount++;
        emit PostLiked(_postId, msg.sender);
    }

    function commentOnPost(uint256 _postId, string memory _content) external {
        require(_postId <= postCounter && _postId > 0, "Invalid post ID");
        Post storage post = posts[_postId];
        require(post.author != address(0), "Post does not exist");

        post.comments.push(Comment(msg.sender, _content));
        emit CommentAdded(_postId, msg.sender, _content);
    }

    function getPost(uint256 _postId) external view returns (
        address author,
        uint256 postId,
        string memory content,
        uint256 likeCount,
        Comment[] memory comments
    ) {
        require(_postId <= postCounter && _postId > 0, "Invalid post ID");
        Post storage post = posts[_postId];
        author = post.author;
        postId = post.postId;
        content = post.content;
        likeCount = post.likeCount;
        comments = post.comments;
    }
}
