//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.4.26;


//factory contract/manager used to create new instances of our contract
//also tracks the addresses of every deployed instance of our contract


contract CampaignFactory {
    
    address[] public campaigns;
    
    function createCampaign(uint minimum) public {
       address newCampaign = new Campaign(minimum, msg.sender);
        campaigns.push(newCampaign);
    }
    
    function getCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}






contract Campaign {
    
    //structs create 'classes' that can be used on a repeatable basis
    //defines a structure for an event or transaction
    //to create instance, create new variable type struct
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        //approvals mapping
        //approval count
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    
    

    
    address public manager;
    uint public minimumContribution;
    
    //mapping with addresses and bools
    uint public approversCount;
    mapping(address => bool) public approvers;
    
    //requests external mapping
    //creates mapping key # value Request data
    
    uint numRequests;
    mapping (uint => Request) public requests;
    
    //modifiers
    
    modifier restricted() {
        require(msg.sender == manager, 'sender not authorized');
        _;
    }
    
    //constructor
    
    constructor(uint minimum, address creator) public {
        
        //establishes manager as creater of contract
        
        manager = creator;
        
        //establishes minimum to enter when contract is created
        
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        
        //checks to make sure minimum is sent to proceed
        
        require(msg.value > minimumContribution);
        
        //if minimum payment is accepted, address is added to approvers
        
        approvers[msg.sender] = true;
        approversCount++;
    }

    
    function createRequest(string memory description, uint value, address recipient) public restricted {            
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }
        
    //function called by approvers to vote on requests
    //only one vote per approver(address)
    //needs to be resliant for larger numbers

    function approveRequest(uint index) public {
        
        //select request 
        
        Request storage request = requests[index];
        
        require(approvers[msg.sender], 'you must contribute to vote on this request!');
        require(!request.approvals[msg.sender], 'you have already voted on this request!');
        
        //add user to approvals map to track they have already voted
        
        request.approvals[msg.sender] = true;
        
        //update approveCount
        request.approvalCount++;
  
        //compare approveCount to total
        //timelimit?
        
    }
    
    function processRequest(uint index) public restricted {
        
        //reference exact copy of request in storage
       
        Request storage request = requests[index];
        
        //check that request has not already been processed
        
        require(!request.complete);
        
        //check that a minimum number of contributors has voted yes on the proposal
        
        require(request.approvalCount >= (approversCount / 2));
        
        //send funds as directed by request
        
        request.recipient.transfer(request.value);
        
        request.complete = true;
        
        numRequests = numRequests--;
        
    }

    //unified function to call all applicable information from deployed contract

    function getSummary() public view returns (uint, uint, uint, uint, address) {

        return(

            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
            
        );

    }
    
    function getRequestsCount() public view returns (uint) {
        return numRequests;
    }
}

    
    
