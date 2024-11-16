// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserVerification {
    struct UserMetadata {
        address user;
        string identifier; 
        uint256 longevity;
        uint256 createdAt;
        bool isVerified;
    }

    UserMetadata[] public _metas;
    bytes[] private _verificationData;
    mapping(address => uint256) public _lastSeen;
    mapping(string => bool) private _usedIdentifiers;
    mapping(address => bool) public verifiedUsers;

    uint256 public constant MIN_LONGEVITY = 30 days;

    event VerificationCreated(
        address indexed user,
        string indexed identifier,
        uint256 index
    );
    event VerificationUpdated(
        address indexed user,
        uint256 index
    );

    function createVerification(
        string calldata identifier,
        uint256 longevity,
        bytes calldata verificationData
    ) external {
        require(!_usedIdentifiers[identifier], "Identifier already used");
        require(longevity >= MIN_LONGEVITY, "Longevity too short");
        require(!verifiedUsers[msg.sender], "Already verified");

        _updateLastSeen();
        
        _metas.push(
            UserMetadata({
                user: msg.sender,
                identifier: identifier,
                longevity: longevity,
                createdAt: block.timestamp,
                isVerified: true
            })
        );
        
        _verificationData.push(verificationData);
        _usedIdentifiers[identifier] = true;
        verifiedUsers[msg.sender] = true;

        emit VerificationCreated(msg.sender, identifier, _metas.length - 1);
    }

    function checkVerification(uint256 index) external view returns (bool isValid) {
        require(index < _metas.length, "No such verification");
        UserMetadata memory meta = _metas[index];
        
        uint256 expiry = _lastSeen[meta.user] + meta.longevity;
        return block.timestamp < expiry;
    }

    function getVerificationData(uint256 index) external view returns (bytes memory) {
        require(index < _metas.length, "No such verification");
        UserMetadata memory meta = _metas[index];
        require(msg.sender == meta.user, "Not authorized");
        
        return _verificationData[index];
    }

    function refreshVerification() external {
        require(verifiedUsers[msg.sender], "Not verified");
        _updateLastSeen();
    }

    function _updateLastSeen() internal {
        _lastSeen[msg.sender] = block.timestamp;
    }

    // View Functions
    function isVerified(address user) external view returns (bool) {
        if (!verifiedUsers[user]) return false;
        
        for(uint i = 0; i < _metas.length; i++) {
            if(_metas[i].user == user) {
                uint256 expiry = _lastSeen[user] + _metas[i].longevity;
                return block.timestamp < expiry;
            }
        }
        return false;
    }

    function getLastSeen(address user) external view returns (uint256) {
        return _lastSeen[user];
    }

    function getVerificationStatus(address user) external view returns (
        bool isVerified,
        uint256 lastSeen,
        string memory identifier
    ) {
        uint256 metaIndex;
        bool found;
        
        for(uint i = 0; i < _metas.length; i++) {
            if(_metas[i].user == user) {
                metaIndex = i;
                found = true;
                break;
            }
        }

        if (!found) return (false, 0, "");

        UserMetadata memory meta = _metas[metaIndex];
        return (
            verifiedUsers[user],
            _lastSeen[user],
            meta.identifier
        );
    }
}