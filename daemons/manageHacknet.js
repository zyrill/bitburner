/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		// find nodes where component upgrades are cheapest 
		var [minimalLevelCost, minimalRamCost, minimalCoreCost] = [Infinity, Infinity, Infinity];
		var [minimalLevel, minimalRam, minimalCore] = [];
		var [minimalLevelNode, minimalRamNode, minimalCoreNode] = [];
		for (var i = 0; i < ns.hacknet.numNodes(); i++) {
			if (ns.hacknet.getLevelUpgradeCost(i) < minimalLevelCost) {
				minimalLevelCost = ns.hacknet.getLevelUpgradeCost(i);
				minimalLevel = ns.hacknet.getNodeStats(i).level;
				minimalLevelNode = i;
			}
			if (ns.hacknet.getRamUpgradeCost(i) < minimalRamCost) {
				minimalRamCost = ns.hacknet.getRamUpgradeCost(i);
				minimalRam = ns.hacknet.getNodeStats(i).ram;
				minimalRamNode = i;
			}
			if (ns.hacknet.getCoreUpgradeCost(i) < minimalCoreCost) {
				minimalCoreCost = ns.hacknet.getCoreUpgradeCost(i);
				minimalCore = ns.hacknet.getNodeStats(i).cores;
				minimalCoreNode = i;
			}
			if (ns.hacknet.getLevelUpgradeCost(i) == Infinity)
				minimalLevel = 200;
			if (ns.hacknet.getRamUpgradeCost(i) == Infinity)
				minimalRam = 64;
			if (ns.hacknet.getCoreUpgradeCost(i) == Infinity)
				minimalCore = 20;	
		}

		var costThreshold = (0.05 * ns.getServerMoneyAvailable("home"));

		// Calculate which component upgrade provides best cost/benefit ratio
		let gainFromLevelUpgrade = 1.6 * Math.pow(1.035, minimalRam - 1) * ((minimalCore + 5) / 6) / minimalLevelCost;
		gainFromLevelUpgrade = Number.isNaN(gainFromLevelUpgrade) ? 0 : gainFromLevelUpgrade;
		let gainFromRamUpgrade = (minimalLevel * 1.6) * (Math.pow(1.035, (2 * minimalRam) - 1) - Math.pow(1.035, minimalRam - 1)) * ((minimalCore + 5) / 6) / minimalRamCost;
		gainFromRamUpgrade = Number.isNaN(gainFromRamUpgrade) ? 0 : gainFromRamUpgrade;
		let gainFromCoreUpgrade = (minimalLevel * 1.6) * Math.pow(1.035, minimalRam - 1) / 6 / minimalCoreCost;
		gainFromCoreUpgrade = Number.isNaN(gainFromCoreUpgrade) ? 0 : gainFromCoreUpgrade;

		if ((minimalLevelCost < costThreshold) || (minimalRamCost < costThreshold) || (minimalCoreCost < costThreshold) || ((ns.hacknet.getPurchaseNodeCost() < costThreshold) && (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()))) {
			// Buy a new node if it is the cheapest available option
			var nodeCost = ns.hacknet.getPurchaseNodeCost();
			if ((nodeCost < minimalLevelCost) && (nodeCost < minimalRamCost) && (nodeCost < minimalCoreCost)) {
				ns.hacknet.purchaseNode();
			}
			// Upgrade component depending on relative merit
			for (var i = 0; i < ns.hacknet.numNodes(); i++) {
				if ((minimalLevelCost < costThreshold) && (gainFromLevelUpgrade >= gainFromRamUpgrade) && (gainFromLevelUpgrade >= gainFromCoreUpgrade)) {
					ns.hacknet.upgradeLevel(minimalLevelNode);
					break;
				}
				if ((minimalRamCost < costThreshold) && (gainFromRamUpgrade >= gainFromLevelUpgrade) && (gainFromRamUpgrade >= gainFromCoreUpgrade)) {
					ns.hacknet.upgradeRam(minimalRamNode);
					break;
				}
				if ((minimalCoreCost < costThreshold) && (gainFromCoreUpgrade > gainFromLevelUpgrade) && (gainFromCoreUpgrade > gainFromRamUpgrade)) {
					ns.hacknet.upgradeCore(minimalCoreNode);
					break;
				}
			}
		}
		if ((ns.hacknet.numNodes() == ns.hacknet.maxNumNodes()) && (minimalLevelCost == Infinity) && (minimalRamCost == Infinity) && (minimalCoreCost == Infinity)) {
			break;
		}
		await ns.sleep(2000);
	}
}