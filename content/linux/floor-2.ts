import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const floor2: NotionInput = {
  slug: "fichiers-et-dossiers",
  floor: 2,
  room: "L'Armurerie",
  concept: "Créer, copier, déplacer, supprimer",
  summary: "Forger ton équipement : mkdir, touch, cp, mv et rm, sans rien détruire par erreur.",
  guardian: {
    name: "Le Forgeron sans nom",
    title: "Maître des lames et des dossiers",
    taunt: "Un seul rm de travers et ton équipement part en fumée.",
  },
  lessons: [
    {
      id: "l2-creer",
      title: "Créer des dossiers et des fichiers",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`mkdir` (make directory) crée un dossier. `touch` crée un fichier vide (ou met à jour sa date s'il existe déjà)." },
        { kind: "code", code: "$ mkdir armes\n$ touch armes/epee.txt\n$ ls armes\nepee.txt" },
        { kind: "p", text: "Pour créer plusieurs niveaux d'un coup, ajoute l'option `-p` :" },
        { kind: "code", code: "$ mkdir -p coffre/or/pieces" },
        { kind: "tip", text: "Sans `-p`, mkdir refuse de créer `coffre/or/pieces` si `coffre/or` n'existe pas encore." },
      ],
    },
    {
      id: "l2-cp-mv-rm",
      title: "Copier, déplacer, supprimer",
      minutes: 8,
      blocks: [
        { kind: "code", code: "$ cp epee.txt epee-copie.txt     # copier un fichier\n$ cp -r armes armes-sauvegarde   # copier un dossier entier\n$ mv epee.txt lame.txt           # renommer\n$ mv lame.txt armes/             # déplacer dans un dossier" },
        { kind: "p", text: "`mv` sert à la fois à **déplacer** et à **renommer** : renommer, c'est déplacer vers un nouveau nom." },
        { kind: "h", text: "Supprimer" },
        { kind: "code", code: "$ rm lame.txt        # supprimer un fichier\n$ rmdir vide         # supprimer un dossier vide\n$ rm -r armes        # supprimer un dossier et tout son contenu" },
        { kind: "warn", text: "Il n'y a pas de corbeille dans le terminal : un fichier supprimé avec rm est perdu. Utilise `rm -i` pour demander confirmation." },
      ],
    },
  ],
  stages: [
    {
      id: "s2-1",
      title: "La forge s'allume",
      description: "Crée tes premiers dossiers et fichiers.",
      xp: 40,
      encounters: [
        { id: "s2-1-a", type: "qcm", prompt: "Quelle commande crée un dossier ?", choices: ["touch", "mkdir", "cd", "new"], answer: [1], explanation: "mkdir = make directory.", skill: "mkdir" },
        { id: "s2-1-b", type: "qcm", prompt: "Quelle commande crée un fichier vide nommé bouclier.txt ?", choices: ["mkdir bouclier.txt", "touch bouclier.txt", "cat bouclier.txt", "ls bouclier.txt"], answer: [1], explanation: "touch crée un fichier vide s'il n'existe pas.", skill: "touch" },
        { id: "s2-1-c", type: "fill", prompt: "Crée toute l'arborescence coffre/or/pieces en une seule commande.", template: "mkdir {{0}} coffre/or/pieces", answers: ["-p"], bank: ["-p", "-r", "-a", "-f"], explanation: "-p crée les dossiers parents manquants.", skill: "mkdir" },
        { id: "s2-1-d", type: "parsons", prompt: "Crée le dossier armes, entre dedans, puis crée le fichier epee.txt.", lines: ["mkdir armes", "cd armes", "touch epee.txt"], distractors: ["touch armes"], explanation: "On crée le dossier, on y entre, puis on crée le fichier.", skill: "mkdir" },
      ],
    },
    {
      id: "s2-2",
      title: "Le reflet de l'acier",
      description: "Copie et déplace sans rien perdre.",
      xp: 50,
      encounters: [
        { id: "s2-2-a", type: "qcm", prompt: "Comment renommer potion.txt en elixir.txt ?", choices: ["cp potion.txt elixir.txt", "mv potion.txt elixir.txt", "rename potion.txt", "rm potion.txt elixir.txt"], answer: [1], explanation: "mv renomme : on déplace le fichier vers un nouveau nom.", skill: "mv" },
        { id: "s2-2-b", type: "qcm", prompt: "Quelle option faut-il pour copier un dossier entier avec cp ?", choices: ["-a", "-p", "-r", "-d"], answer: [2], explanation: "-r (récursif) copie le dossier et tout son contenu.", skill: "cp" },
        { id: "s2-2-c", type: "predict", prompt: "Le dossier contient seulement carte.txt. Qu'affiche ls après ces commandes ?", code: "$ cp carte.txt copie.txt\n$ mv carte.txt plan.txt\n$ ls", accepted: ["copie.txt plan.txt"], explanation: "cp crée copie.txt, mv renomme carte.txt en plan.txt.", skill: "cp" },
        { id: "s2-2-d", type: "fill", prompt: "Déplace epee.txt dans le dossier armes.", template: "{{0}} epee.txt {{1}}", answers: ["mv", "armes/"], bank: ["mv", "cp", "armes/", "rm", "../"], explanation: "mv fichier dossier/ déplace le fichier dans le dossier.", skill: "mv" },
      ],
    },
    {
      id: "s2-3",
      title: "La lame qui efface",
      description: "Supprimer est facile. Supprimer sans regret, c'est un art.",
      xp: 60,
      encounters: [
        { id: "s2-3-a", type: "qcm", prompt: "Quelle commande supprime un dossier non vide et tout son contenu ?", choices: ["rmdir armes", "rm armes", "rm -r armes", "del armes"], answer: [2], explanation: "rm -r supprime récursivement. rmdir ne marche que sur un dossier vide.", skill: "rm" },
        { id: "s2-3-b", type: "qcm", prompt: "Que se passe-t-il après rm tresor.txt ?", choices: ["Le fichier va dans la corbeille", "Le fichier est définitivement supprimé", "Le fichier est caché", "Rien sans sudo"], answer: [1], explanation: "Le terminal n'a pas de corbeille : la suppression est définitive.", skill: "rm" },
        { id: "s2-3-c", type: "fill", prompt: "Supprime piege.txt en demandant une confirmation.", template: "rm {{0}} piege.txt", answers: ["-i"], bank: ["-i", "-r", "-f", "-p"], explanation: "-i (interactive) demande confirmation avant chaque suppression.", skill: "rm" },
        { id: "s2-3-d", type: "parsons", prompt: "Sauvegarde le dossier armes, puis supprime l'original.", lines: ["cp -r armes armes-sauvegarde", "rm -r armes"], distractors: ["rmdir armes"], explanation: "On sauvegarde d'abord, on supprime ensuite. rmdir échouerait car armes n'est pas vide.", skill: "cp" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "c2-1", type: "qcm", prompt: "Quelle commande crée un fichier vide ?", choices: ["mkdir", "touch", "cp", "mv"], answer: [1], explanation: "touch crée un fichier vide.", skill: "touch" },
      { id: "c2-2", type: "qcm", prompt: "mv sert à… (plusieurs réponses)", choices: ["déplacer", "renommer", "copier", "supprimer"], answer: [0, 1], explanation: "mv déplace et renomme, mais ne copie pas.", skill: "mv" },
      { id: "c2-3", type: "fill", prompt: "Copie le dossier sac dans sac2.", template: "cp {{0}} sac sac2", answers: ["-r"], bank: ["-r", "-i", "-p", "-a"], explanation: "Un dossier se copie avec -r.", skill: "cp" },
      { id: "c2-4", type: "qcm", prompt: "rmdir coffre échoue. Pourquoi ?", choices: ["coffre n'est pas vide", "rmdir n'existe pas", "Il faut être dans coffre", "coffre est un fichier caché"], answer: [0], explanation: "rmdir ne supprime que les dossiers vides.", skill: "rm" },
      { id: "c2-5", type: "predict", prompt: "Le dossier est vide. Qu'affiche ls ?", code: "$ mkdir a b\n$ touch a/x.txt\n$ rm -r b\n$ ls", accepted: ["a"], explanation: "b est supprimé, il ne reste que le dossier a.", skill: "rm" },
      { id: "c2-6", type: "fill", prompt: "Crée l'arborescence quete/acte1/scene1.", template: "mkdir {{0}} quete/acte1/scene1", answers: ["-p"], bank: ["-p", "-r", "-i"], explanation: "-p crée tous les dossiers parents.", skill: "mkdir" },
      { id: "c2-7", type: "qcm", prompt: "Quelle commande est la plus prudente pour supprimer ?", choices: ["rm -rf *", "rm -i fichier", "rm -r /", "rm *"], answer: [1], explanation: "rm -i demande une confirmation avant de supprimer.", skill: "rm" },
      { id: "c2-8", type: "parsons", prompt: "Crée notes.txt puis renomme-le en journal.txt.", lines: ["touch notes.txt", "mv notes.txt journal.txt"], distractors: ["cp notes.txt"], explanation: "touch crée, mv renomme.", skill: "mv" },
    ],
  },
};
