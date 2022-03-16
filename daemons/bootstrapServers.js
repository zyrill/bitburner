/** @param {NS} ns **/
import { listHosts } from './listHosts.js';

export async function main(ns) {
	while (true) {
		var hostList = listHosts(ns, "home", []);
		hostList.forEach(async function (host) {
			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host)) {
				ns.exec('nuke.js', 'home', 1, host);
			}
		})
		await ns.sleep(100000);
	}
}