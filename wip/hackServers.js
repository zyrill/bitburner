/** @param {NS} ns **/
export async function main(ns) {
	var host = "n00dles";
	var server = "home";

	try {
		let getServerFreeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
		while (getServerFreeRam > (0.005 * ns.getServerMaxRam(server))) {
			let relativeSecurityLevel = ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host);
			let growThreadsTotal = Math.ceil(ns.growthAnalyze(host, (ns.getServerMaxMoney(host)+1 / (ns.getServerMoneyAvailable(host) + 1))));
			let growSecurityIncrease = ns.growthAnalyzeSecurity(growThreadsTotal);
			let compensateGrowThreadsTotal = Math.ceil((relativeSecurityLevel + growSecurityIncrease) / 0.05);
			let hackThreadsTotal = Math.ceil(0.999 / ns.hackAnalyze(host));
			let hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadsTotal);
			let compensateHackThreadsTotal = Math.ceil(hackSecurityIncrease / 0.05);
			getServerFreeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
		
			let weakenTime = ns.getWeakenTime(host);
			let growTime = ns.getGrowTime(host);
			let hackTime = ns.getHackTime(host);
		
			ns.tprint("weakenTime "+weakenTime);
			ns.tprint("growTime "+growTime);
			ns.tprint("hackTime "+hackTime);
		
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
						ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + i * growTime));
					} else {
						ns.exec("grow.js", server, growThreadsRemaining, host, (i * growTime));
						ns.exec("weaken.js", server, compensateGrowThreadsActual, host, (1000 + i * growTime));
					}
					growThreadsRemaining = growThreadsRemaining - growThreadsActual;
					i++;
				}
			} else {
				ns.exec("grow.js", server, growThreadsTotal, host, 0);
				ns.exec("weaken.js", server, compensateGrowThreadsTotal, host, 1000);
			}
			let j = 0;
			if (getServerFreeRam < (hackThreadsTotal * ns.getScriptRam('hack.js') + compensateHackThreadsTotal * ns.getScriptRam('weaken.js'))) {
				let offsetHack = (i - 1) * weakenTime;
				let hackThreadsRatio = hackThreadsTotal / (hackThreadsTotal + compensateHackThreadsTotal);
				let scriptRamUsageTotal = ns.getScriptRam('hack.js') + ns.getScriptRam('weaken.js');
				let hackThreadsActual = Math.floor(getServerFreeRam / (hackThreadsRatio * scriptRamUsageTotal));
				let compensateHackThreadsRatio = compensateHackThreadsTotal / (hackThreadsTotal + compensateHackThreadsTotal);
				let compensateHackThreadsActual = Math.floor(getServerFreeRam / (compensateHackThreadsRatio * scriptRamUsageTotal));
				let hackThreadsRemaining = hackThreadsTotal - hackThreadsActual;
				while (hackThreadsRemaining > 0) {
					if (hackThreadsRemaining >= hackThreadsActual) {
						ns.exec("hack.js", server, hackThreadsActual, host, (offsetHack + 2000 + weakenTime - hackTime));
						ns.exec("weaken.js", server, compensateHackThreadsActual, host, (offsetHack + 3000 + (j + 1) * weakenTime));
					} else {
						ns.exec("hack.js", server, hackThreadsRemaining, host, (offsetHack + 2000 + weakenTime - hackTime));
						ns.exec("weaken.js", server, compensateHackThreadsActual, host, (offsetHack + 3000 + (j + 1) * weakenTime));
					}
					hackThreadsRemaining = hackThreadsRemaining - hackThreadsActual;
					j++;
				}
			} else {
				ns.exec("hack.js", server, hackThreadsTotal, host, (2000 + weakenTime - hackTime));
				ns.exec("weaken.js", server, compensateHackThreadsTotal, host, 3000);
			}
			ns.tprint("Free RAM: "+(ns.getServerMaxRam(server) - ns.getServerUsedRam(server)));
		}
	}
	catch (e) {
		ns.tprint("Exception occured: "+e);
	}
}