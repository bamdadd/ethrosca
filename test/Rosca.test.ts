import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract, Signer} from "ethers";

describe("ROSCA Contract", function () {
    let rosca: Contract;
    let signers: Signer[];

    beforeEach(async function () {
        signers = await ethers.getSigners();
        const ROSCA = await ethers.getContractFactory("ROSCA");
        rosca = await ROSCA.deploy();
    });

    it("Should simulate 10 months of ROSCA for 1 ETH", async function () {
        // Each member contributes 1 ETH
        for (const signer of signers.slice(0, 10)) {
            const response = await rosca
                .connect(signer)
                .contribute({value: ethers.utils.parseEther("1")});
            expect(response).to.emit(rosca, "Contribution");

        }

        // Simulate 10 months
        for (let i = 0; i < 10; i++) {
            const tx = await rosca.connect(signers[i]).withdraw();
            await expect(tx)
                .to.emit(rosca, "Withdrawal")
                .withArgs(await signers[i].getAddress(), ethers.utils.parseEther("1"));
            expect(await ethers.provider.getBalance(rosca.address)).to.equal(
                ethers.utils.parseEther(`${9 - i}`)
            );
        }
    });

    it("Should simulate 11 users contributing to the ROSCA contract", async function () {
        // Each member contributes 1 ETH
        const membersCount = 11;
        for (const signer of signers.slice(0, membersCount)) {

            const response = await rosca
                .connect(signer)
                .contribute({value: ethers.utils.parseEther("1")});
            expect(response).to.emit(rosca, "Contribution");
        }

        // check contract balance
        expect(await ethers.provider.getBalance(rosca.address)).to.equal(
            ethers.utils.parseEther(membersCount.toString())
        );

        // get membersCount of members
        const members = await rosca.getMembers();
        expect(members.length).to.equal(membersCount);

        for (let i = 0; i < membersCount; i++) {
            const tx = await rosca.connect(signers[i]).withdraw();
            await expect(tx)
                .to.emit(rosca, "Withdrawal")
                .withArgs(await signers[i].getAddress(), ethers.utils.parseEther("1"));

            expect(await ethers.provider.getBalance(rosca.address)).to.equal(
                ethers.utils.parseEther(`${membersCount - i -1}`)
            );
        }

        await expect(rosca.connect(signers[0]).withdraw()).to.be.revertedWith("Already withdrawn");
    });

});
