import commands from "../commands";
import { Command, Command } from "../types";
import { EditReply, event, Reply } from "../utils";

const allCommands = commands.map(({commands})=> commands).flat()
const allCommandsMap= new Map<string,Command>(
    allCommands.map((c) =>[c.meta.name,c])
)
export default event('interactionCreate', async({
    log,
    client,
},
interaction,
)=>{
    if (!interaction.isChatInputCommand()) return

    try {
        const commandName = interaction.commandName
        const command = allCommandsMap.get(commandName)
        if(!command) throw new Error('Command not found')
    } catch (error) {
        
    }
})