import { print } from "gluegun/print"

const { cyan, gray, white, bold, yellow } = print.colors
const { underline } = print.colors

export const p = (m = "") => print.info(gray(`   ${m}`))
export const heading = (m = "") => p(white(bold(m)))
export const link = (m = "") => underline(white(m))
// export const pressHeading = (m = "") => p(red(bold(m)))
export const pressHeading = () =>
  p(
    cyan(`
     ___         ___           ___           ___           ___      
    /\\  \\       /\\  \\         /\\__\\         /\\__\\         /\\__\\     
   /::\\  \\     /::\\  \\       /:/ _/_       /:/ _/_       /:/ _/_    
  /:/\\:\\__\\   /:/\\:\\__\\     /:/ /\\__\\     /:/ /\\  \\     /:/ /\\  \\   
 /:/ /:/  /  /:/ /:/  /    /:/ /:/ _/_   /:/ /::\\  \\   /:/ /::\\  \\  
/:/_/:/  /  /:/_/:/__/___ /:/_/:/ /\\__\\ /:/_/:/\\:\\__\\ /:/_/:/\\:\\__\\ 
\\:\\/:/  /   \\:\\/:::::/  / \\:\\/:/ /:/  / \\:\\/:/ /:/  / \\:\\/:/ /:/  / 
 \\::/__/     \\::/~~/~~~~   \\::/_/:/  /   \\::/ /:/  /   \\::/ /:/  /  
  \\:\\  \\      \\:\\~~\\        \\:\\/:/  /     \\/_/:/  /     \\/_/:/  /   
   \\:\\__\\      \\:\\__\\        \\::/  /        /:/  /        /:/  /    
    \\/__/       \\/__/         \\/__/         \\/__/         \\/__/     
    
    `,
    ),
  )
export const command = (m = "", second = "", examples: string[] = []) => {
  p(white(m) + "  " + gray(second))
  const indent = m.length + 2
  if (examples) {
    examples.forEach((ex) => p(gray(" ".repeat(indent) + ex)))
  }
}
export const direction = (m = "") => p(cyan(m))
export const warning = (m = "") => p(yellow(m))
