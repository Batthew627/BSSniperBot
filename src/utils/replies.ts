import { InteractionReplyOptions } from 'discord.js';
export const Colors = {
    error: 0xff0000,
};
export const Reply= {
    error(msg:string):InteractionReplyOptions {
        return {
            ephemeral: true,
            embeds: [{
                color: Colors.error,
                description: msg,
            },
            ],
        };
    },
};
export const EditReply= {
    error(msg:string):InteractionReplyOptions {
        return {
            embeds: [{
                color: Colors.error,
                description: msg,
            },
            ],
        };
    },
};
