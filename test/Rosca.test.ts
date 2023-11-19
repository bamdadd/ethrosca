import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract, Signer} from "ethers";

describe("ROSCA Contract", function () {
    let rosca: Contract;
    let signers: Signer[];

    before(async function () {
        signers = await ethers.getSigners();
        const ROSCA = await ethers.getContractFactory("ROSCA");
        rosca = await ROSCA.deploy(signers.slice(0, 10).map((s) => s.getAddress()));
    });

    it("Should simulate 10 months of ROSCA for 1 ETH", async function () {
        // Each member contributes 1 ETH
        for (const signer of signers.slice(0, 10)) {
            await rosca
                .connect(signer)
                .contribute({value: ethers.utils.parseEther("1")});
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
});
