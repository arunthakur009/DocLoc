// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract EnhancedDigitalLocker {
    struct Document {
        string cid;
        string docType;
        uint256 timestamp;
    }

    address public admin;
    mapping(address => string) private keyMap;
    mapping(string => address) private keyOwner;
    mapping(address => bool) public loggedIn;
    mapping(string => Document[]) private keyDocuments;
    mapping(address => mapping(address => bool)) public hasAccess;

    event DocumentAdded(string indexed key, string cid);
    event AccessChanged(address indexed owner, address indexed user, bool access);

    constructor() {
        admin = msg.sender;
    }

    modifier isLoggedIn() {
        require(loggedIn[msg.sender], "User not logged in");
        _;
    }

    function setKey(string memory _key) external {
        require(bytes(keyMap[msg.sender]).length == 0, "Key already set");
        keyMap[msg.sender] = _key;
        keyOwner[_key] = msg.sender;
    }

    function login(string memory _key) external {
        require(keccak256(bytes(keyMap[msg.sender])) == keccak256(bytes(_key)), "Invalid key");
        loggedIn[msg.sender] = true;
    }

    function logout() external {
        loggedIn[msg.sender] = false;
    }

    function addDocument(string calldata key, string calldata cid, string calldata docType) external isLoggedIn {
        require(msg.sender == keyOwner[key] || hasAccess[keyOwner[key]][msg.sender], "Access denied");
        keyDocuments[key].push(Document(cid, docType, block.timestamp));
        emit DocumentAdded(key, cid);
    }

    function getDocumentsByKey(string calldata key) external view isLoggedIn returns (Document[] memory) {
        require(msg.sender == keyOwner[key] || hasAccess[keyOwner[key]][msg.sender], "Access denied");
        return keyDocuments[key];
    }

    function allowAccess(address user) external isLoggedIn {
        hasAccess[msg.sender][user] = true;
        emit AccessChanged(msg.sender, user, true);
    }

    function disallowAccess(address user) external isLoggedIn {
        hasAccess[msg.sender][user] = false;
        emit AccessChanged(msg.sender, user, false);
    }
}

