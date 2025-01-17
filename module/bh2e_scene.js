/**
 * This class is derived from the standard FoundryVTT Scene class for the sole
 * purpose of allowing for the randomization of creature HP when they are added
 * to a scene.
 */
export default class BH2eScene extends Scene {
	_onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
		super._onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId);

        if(game.settings.get("bh2e", "randomizeCreatureHP")) {
			if(embeddedName === "Token") {
				let sceneTokens = Array.from(game.scenes.current.tokens);
				let tokens      = [];

				result.forEach((entry) => {
					let token = sceneTokens.find((t) => t.id === entry._id);

					if(token) {
						tokens.push(token);
					}
				});

				tokens.forEach((token) => {
					let actor = token.actor;
					if(actor.type === "creature" && actor.data.data.hitDice > 0) {
						let formula = `${actor.data.data.hitDice}d8`;
						(new Roll(formula)).evaluate({async: true}).then((roll) => {
							let data = {actorData: {
								            data: {
								            	hitPoints: {
								            		max:   roll.total,
								            		value: roll.total
								            	}
								            }
								        }};
							token.update(data);
						});
					}
				});
			}
		}
	}
}