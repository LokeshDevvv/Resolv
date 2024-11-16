const PolygonZkEVM = '0x562db143B891D2D05A9e8B72c7DA59077E66A081'
const ScrollSepolia = '0x13d31A2Eac646a6828b7A118204077Fb790fc0B7'
const BaseSepolia = '0x82B66862E605d5365128dcA5709Ab598b31D0e34'
const ZircuitTestnet = '0xB6dd2F403c14bB495B505724b4dA21582a1377aB'

const CommonABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reportId",
                "type": "uint256"
            }
        ],
        "name": "markReportFlagged",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reportId",
                "type": "uint256"
            }
        ],
        "name": "markReportSolved",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "reason",
                "type": "string"
            }
        ],
        "name": "PointsUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "reportId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum ReportContract.ReportStatus",
                "name": "newStatus",
                "type": "uint8"
            }
        ],
        "name": "ReportStatusUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "reportId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "reporter",
                "type": "address"
            }
        ],
        "name": "ReportSubmitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "reportId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isUpvote",
                "type": "bool"
            }
        ],
        "name": "ReportVoted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_details",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_publicLocation",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_mediaCID",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_category",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_priority",
                "type": "uint256"
            }
        ],
        "name": "submitReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reportId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_isUpvote",
                "type": "bool"
            }
        ],
        "name": "voteReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_limit",
                "type": "uint256"
            }
        ],
        "name": "getAllReports",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "reportId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "reportHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "details",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "publicLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "mediaCID",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priority",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum ReportContract.ReportStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "reporter",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upvotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "downvotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isSolved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct ReportContract.ReportView[]",
                "name": "reportArray",
                "type": "tuple[]"
            },
            {
                "internalType": "uint256",
                "name": "total",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reportId",
                "type": "uint256"
            }
        ],
        "name": "getReport",
        "outputs": [
            {
                "internalType": "string",
                "name": "publicLocation",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "mediaCID",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "priority",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "enum ReportContract.ReportStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "reporter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "upvotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "downvotes",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isSolved",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserProfile",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reportsSubmitted",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "successfulReports",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastReportTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_limit",
                "type": "uint256"
            }
        ],
        "name": "getUserReports",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "reportId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "reportHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "details",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "publicLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "mediaCID",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priority",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum ReportContract.ReportStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "reporter",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upvotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "downvotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isSolved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct ReportContract.ReportView[]",
                "name": "userReports",
                "type": "tuple[]"
            },
            {
                "internalType": "uint256",
                "name": "totalUserReports",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reportId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "POINTS_DEDUCTION_DOWNVOTE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "POINTS_FOR_REPORT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "POINTS_FOR_SOLVING",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "POINTS_FOR_UPVOTE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "REPORT_COOLDOWN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reportCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reports",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "reportHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "details",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "publicLocation",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "mediaCID",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "category",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "priority",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "enum ReportContract.ReportStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "reporter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "upvotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "downvotes",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isSolved",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "reportVotes",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userProfiles",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reportsSubmitted",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "successfulReports",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastReportTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export {BaseSepolia, ScrollSepolia, CommonABI, PolygonZkEVM, ZircuitTestnet}