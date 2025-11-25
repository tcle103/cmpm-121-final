# Devlog Entry - 11/14/25

## Introducing the team

Either organizing by person or by role, tell us who will do what on your team. Your team should span at least the following four roles:

    Tools Lead: **Tien Le** 
    This person will research alternative tools, identify good ones, and help every other team member set them up on their own machine in the best configuration for your project. This person might also establish your team’s coding style guidelines and help peers setup auto-formatting systems. This person should provide support for systems like source control and automated deployment (if appropriate to your team’s approach).
    Engine Lead: **Tien Le** 
    This person will research alternative engines, get buy-in from teammates on the choice, and teach peers how to use it if it is new to them. This might involve making small code examples outside of the main game project to teach others. The Engine Lead should also establish standards for which kinds of code should be organized into which folders of the project. They should try to propose software designs that insulate the rest of the team from many details of the underlying engine.
    Design Lead **Samuel Rex Spivey**: 
    This person will be responsible for setting the creative direction of the project, and establishing the look and feel of the game. They might make small art or code samples for others to help them contribute and maintain game content. Where the project might involve a domain-specific language, the Design Lead (who is still an engineer in this class) will lead the discussion as to what primitive elements the language needs to provide.
    Testing Lead: **Cameron Coleman** 
    This person will be responsible for both any automated testing that happens within the codebase as well as organizing and reporting on human playtests beyond the team.

If your team has fewer than four people, some people will need to be the lead for multiple disciplines, but no person should be the lead for more than two disciplines.

If your team has more than four people, you are welcome to sub-divide the roles above into more specific roles or tag people as Assistant or Backup for one of the existing roles. Alternatively, you could invent new lead roles if your team is going to try a special game design technique (e.g. assign a Procgen Lead if your team is planning to use procedural generation).

Overall, the four main disciplines all need to be associated with the name of specific people on your team.

## Tools and materials

- **Engine** - We are intending to use the [baseline web platform](https://web.dev/baseline) with the [three.js](https://threejs.org/) library for 3D rendering support and the [ammo.js](https://github.com/kripken/ammo.js) library for physics. These libraries are very well-documented, as well as having demonstrated compatibility with each other. Ammo.js also appears to have built-in, high-level specifications very similar to Unity, a platform we are all reasonably experienced in; this would allow us to get to development quicker than working in something lower level like p5.
- **Language** - We are planning to use TypeScript for our main programming language and JSON for our data language, where applicable. We've been using them throughout this class, and they are compatible with our engine/libraries discussed above.
- **Tools** - We will likely use VSCode (either in Codespaces or local, depending on our individual set-ups) as our IDE, Blender for any major 3D mesh manipulation/creation, and GitHub for version control. This is primarily because we are comfortable using these tools, and because they are free and readily available to us.
- **Gen. AI** - Gen. AI use is left to individual discretion; the degree to which these are used or whether they are agentic or not will also be up to each individual team member. We believe that we can each judge best how gen. AI can assist us.

## Outlook

Give us a short section on your outlook on the project. You might cover one or more of these topics:

    The plan for the project is to make a 3-dimensional slingshot game (in which the goal is still undecided). We are hoping to learn collaboration and how to better use three.js. We anticipate that the hardest part of the project will likely be learning how to use the libraries that we are unfamiliar with, as well as creating satisfying physics.
