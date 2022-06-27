// SPDX-License-Identifier: CC-BY-SA-4.0
pragma solidity ^0.8.7;

contract PeanutButterFactory {
    
    address payable owner;
    uint public constant MAX_JARS = 32;
    uint public currentJarId = 0;

    mapping (string => bool) private extraIngredients;

    struct Jar {
        string extraIngredients;
        uint256 paidValue;
        address creator;
    }

    Jar[MAX_JARS] jars;
    
    constructor() {
        owner = payable(msg.sender);
        setExtraIngredients();
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function create(string[] memory jarExtraIngredients) public payable {
        require(jarExtraIngredients.length <= 4, "Max of 4 ingredients!");
        for (uint i = 0; i < jarExtraIngredients.length; i++) {
            require(extraIngredients[jarExtraIngredients[i]], string(abi.encodePacked(jarExtraIngredients[i], " is not in extra ingredients list!")));
        }
        require(msg.value >= 0.001 ether, "Minimum value of 0.001 ether!");
        jars[currentJarId] = Jar(parseJarExtraIngredients(jarExtraIngredients), msg.value, msg.sender);
        currentJarId += 1;
    }

    function buy(uint id) public payable {
        uint minimumValue = jars[id].paidValue + jars[id].paidValue / 100;
        require(msg.value >= minimumValue, string(abi.encodePacked("Value must be >= ", minimumValue)));
        (bool sent, ) = jars[id].creator.call{value: msg.value / 100}("");
        require(sent, "Something went wrong!");
    }

    function getJar(uint id) public view returns (Jar memory) {
        return jars[id];
    }

    function getJars() public view returns (Jar[MAX_JARS] memory) {
        return jars;
    }

    function getExtraIngredients() public pure returns (string[12] memory) {
        return [
            "salt", "sugar", "cinnamon", "chocolate",
            "peanuts", "pecan", "chips", "pretzel",
            "banana", "brownie", "black pepper", "chili pepper"
        ];
    }

    function getJarsExtraIngredients() public view returns (string[MAX_JARS] memory) {
        string[MAX_JARS] memory jarsExtraIngredients;
        for (uint i = 0; i < jars.length; i++) {
            jarsExtraIngredients[i] = jars[i].extraIngredients;
        }
        return jarsExtraIngredients;
    }

    function withdrawAll() public onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw!");
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    function parseJarExtraIngredients(string[] memory jarExtraIngredients) private pure returns (string memory) {
        uint numberOfIngredients = jarExtraIngredients.length;
        if (numberOfIngredients == 0) return '';
        if (numberOfIngredients == 1) return jarExtraIngredients[0];
        string memory ingredients;
        for (uint i = 0; i < numberOfIngredients; i++) {
            ingredients = string(abi.encodePacked(ingredients, ', ', jarExtraIngredients[i]));
        }
        return ingredients;
    }

    function setExtraIngredients() private {
        extraIngredients["salt"] = true;
        extraIngredients["sugar"] = true;
        extraIngredients["cinnamon"] = true;
        extraIngredients["chocolate"] = true;
        extraIngredients["peanuts"] = true;
        extraIngredients["pecan"] = true;
        extraIngredients["chips"] = true;
        extraIngredients["pretzel"] = true;
        extraIngredients["banana"] = true;
        extraIngredients["brownie"] = true;
        extraIngredients["black pepper"] = true;
        extraIngredients["chili pepper"] = true;
    }
}