/** @param {NS} ns **/
export function batchRun(server, host) {
	let relativeSecurityLevel = ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host);
	let getServerFreeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	let growThreadsTotal = Math.ceil(ns.growthAnalyze(host, (ns.getServerMaxMoney(host) / (ns.getServerMoneyAvailable(host)+1))));
	let growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadsTotal);
	let compensateGrowThreadsTotal = Math.ceil((relativeSecurityLevel + growSecurityIncrease) / 0.05);
	let hackThreadsTotal = Math.ceil(0.999 / ns.hackAnalyze(host));
	let hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadsTotal);
	let compensateHackThreadsTotal = Math.ceil(hackSecurityIncrease / 0.05);

	let weakenTime = ns.getWeakenTime(host);
	let growTime = ns.getGrowTime(host);
	let hackTime = ns.getHackTime(host);

	let i = 0;
	if (getServerFreeRam < (growThreadsTotal * ns.getScriptRam('grow.js') + compensateGrowThreadsTotal * ns.getScriptRam('weaken.js'))) {
		let growThreadsRatio = growThreadsTotal / (growThreadsTotal + compensateGrowThreadsTotal);
		let scriptRamUsageTotal = ns.getScriptRam('grow.js') + ns.getScriptRam('weaken.js');
		let growThreadsActual = Math.floor(getServerFreeRam / (growThreadsRatio * scriptRamUsageTotal));
		let compensateGrowThreadsRatio = compensateGrowThreadsTotal / (growThreadsTotal + compensateGrowThreadsTotal);
		let compensateGrowThreadsActual = Math.floor(getServerFreeRam / (compensateGrowThreadsRatio * scriptRamUsageTotal));
		let growThreadsRemaining = growThreadsTotal - growThreadsActual;
		while (growThreadsRemaining > 0) {
			if (growThreadsRemaining >= growThreadsActual) {
				ns.exec("grow.js", server, growThreadsActual, host, (i * growTime));
				ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + (i + 1) * (growTime - weakenTime)));
			} else {
				ns.exec("grow.js", server, growThreadsRemaining, host, (i * growTime));	
				ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + (i + 1) * (growTime - weakenTime)));
			}
			growThreadsRemaining = growThreadsRemaining - growThreadsActual;
			i++;
		}
	} else {
		ns.exec("grow.js", server, growThreadsTotal, host, 0);
		ns.exec("weaken.js", server, compensateGrowThreadsNeeded, host, (1000 + growTime - weakenTime));
	}
	if (getServerFreeRam < (hackThreadsTotal * ns.getScriptRam('hack.js') + compensateHackThreadsTotal * ns.getScriptRam('weaken.js'))) {
		let offsetHack = i * growTime;
		let hackThreadsRatio = hackThreadsTotal / (hackThreadsTotal + compensateHackThreadsTotal);
		let scriptRamUsageTotal = ns.getScriptRam('grow.js') + ns.getScriptRam('weaken.js');
		let growThreadsActual = Math.floor(getServerFreeRam / (growThreadsRatio * scriptRamUsageTotal));
		let compensateGrowThreadsRatio = compensateGrowThreadsTotal / (growThreadsTotal + compensateGrowThreadsTotal);
		let compensateGrowThreadsActual = Math.floor(getServerFreeRam / (compensateGrowThreadsRatio * scriptRamUsageTotal));
		let growThreadsRemaining = growThreadsTotal - growThreadsActual;
		while (growThreadsRemaining > 0) {
			if (growThreadsRemaining >= growThreadsActual) {
				ns.exec("grow.js", server, growThreadsActual, host, (i * growTime));
				ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + (i + 1) * (growTime - weakenTime)));
			} else {
				ns.exec("grow.js", server, growThreadsRemaining, host, (i * growTime));	
				ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + (i + 1) * (growTime - weakenTime)));
			}
			growThreadsRemaining = growThreadsRemaining - growThreadsActual;
			i++;
		}
	}
}

export async function main(ns) {
	//var host = "n00dles";
	var host = "foodnstuff";
	//var host = "sigma-cosmetics";
	//var host = "joesguns";
		
	// Regularly check if new servers are available for bootstrap
	// bootstrapServers.js

	// Schedule scripts
	// The logic for delegating scheduling to e.g. a botnet would need to go here
	var server = "home";

	// Calculate threads necessary for maximum growth, hack and weaken 
	var relativeSecurityLevel = ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host);
	var getServerFreeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	
	var growThreadsNeeded = Math.ceil(ns.growthAnalyze(host, (ns.getServerMaxMoney(host) / (ns.getServerMoneyAvailable(host)+1))));
	// If thread count surpasses server ram, scale down
	if (getServerFreeRam < (growThreadsNeeded * ns.getScriptRam('grow.js')))
		growThreadsNeeded = Math.floor(getServerFreeRam / ns.getScriptRam('grow.js'));
	var growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadsNeeded);
	// Do not assume host is optimized and account for relativeSecurityLevel
	var compensateGrowThreadsNeeded = Math.ceil((relativeSecurityLevel + growSecurityIncrease) / 0.05);
	// If thread count surpasses server ram, scale down
	if (getServerFreeRam < (compensateGrowThreadsNeeded * ns.getScriptRam('weaken.js')))
		compensateGrowThreadsNeeded = Math.floor(getServerFreeRam / ns.getScriptRam('weaken.js'));
	
	ns.tprint(ns.hackAnalyze(host));
	var hackThreadsNeeded = Math.ceil(0.999 / ns.hackAnalyze(host));
	// If thread count surpasses server ram, scale down
	if (getServerFreeRam < (hackThreadsNeeded * ns.getScriptRam('hack.js')))
		hackThreadsNeeded = Math.floor(getServerFreeRam / ns.getScriptRam('hack.js'));
	var hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadsNeeded);
	ns.tprint("hackThreadsNeeded: "+hackThreadsNeeded);
	// Shouldn't need to account for relativeSecurityLevel as that already happened during compensation for growth
	var compensateHackThreadsNeeded = Math.ceil(hackSecurityIncrease / 0.05);
	// If thread count surpasses server ram, scale down
	if (getServerFreeRam < (compensateHackThreadsNeeded * ns.getScriptRam('weaken.js')))
		compensateHackThreadsNeeded = Math.floor(getServerFreeRam / ns.getScriptRam('weaken.js'));
	
	var weakenTime = ns.getWeakenTime(host);
	var growTime = ns.getGrowTime(host);
	var hackTime = ns.getHackTime(host);
	//ns.tprint("weakenTime: "+weakenTime);
	//ns.tprint("growTime: "+growTime);
	//ns.tprint("hackTime: "+hackTime);
	//ns.tprint("growThreadsNeeded: "+growThreadsNeeded);
	//ns.tprint("hackThreadsNeeded: "+hackThreadsNeeded);
	//ns.tprint("compensateGrowThreadsNeeded: "+compensateGrowThreadsNeeded);
	//ns.tprint("compensateHackThreadsNeeded: "+compensateHackThreadsNeeded);

	// Calculate necessary delays to have scripts finish within a few seconds
	// of each other to be able to batch them continuously
	ns.exec("grow.js", server, growThreadsNeeded, host, 0);
	ns.exec("weaken.js", server, compensateGrowThreadsNeeded, host, 1000);
	ns.exec("hack.js", server, hackThreadsNeeded, host, (2000 + weakenTime - hackTime));
	ns.exec("weaken.js", server, compensateHackThreadsNeeded, host, 3000);
}