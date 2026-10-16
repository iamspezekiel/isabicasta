export interface OnboardingSlide {
  title: string;
  body: string;
  /** A Scripture quotation, shown as a subordinate quote. Null on the framing slides. */
  verse: string | null;
}

/**
 * The six onboarding slides, verbatim from the existing app. Scripture is
 * quoted exactly — never paraphrased — and the final slide carries the app's
 * only disclaimer, which is also reachable later from the "How it works" screen
 * for anyone who skipped this intro.
 */
export const SLIDES: readonly OnboardingSlide[] = [
  {
    title: "Welcome to IsabiCasta",
    body: "A simple tool to help when you are indecisive. Inspired by the ancient biblical practice of casting lots — a way people used to make decisions and discern direction.",
    verse: null,
  },
  {
    title: "Jonah and the Sailors",
    body: "When a great storm threatened the ship, the sailors cast lots to discover who was responsible. The lot fell on Jonah.",
    verse:
      "Jonah 1:7 — “And they said to one another, ‘Come, let us cast lots, that we may know on whose account this evil has come upon us.’ So they cast lots, and the lot fell on Jonah.”",
  },
  {
    title: "The Lord and the Lot",
    body: "Scripture affirms that the outcome of the lot is under God’s sovereignty. Lots were used for decisions ranging from dividing land to selecting people for sacred duty.",
    verse:
      "Proverbs 16:33 — “The lot is cast into the lap, but its every decision is from the Lord.”",
  },
  {
    title: "The Day of Atonement",
    body: "On the Day of Atonement, two goats were presented. Lots determined which goat would be offered to the Lord and which would be the scapegoat.",
    verse:
      "Leviticus 16:8 — “And Aaron shall cast lots over the two goats, one lot for the Lord and the other lot for Azazel.”",
  },
  {
    title: "Choosing Matthias",
    body: "After Judas’ betrayal, the apostles sought a replacement. They prayed and cast lots; the lot fell on Matthias, who was numbered with the eleven.",
    verse:
      "Acts 1:26 — “And they cast lots for them, and the lot fell on Matthias, and he was numbered with the eleven apostles.”",
  },
  {
    title: "A Tool, Not a Prophecy",
    body: "IsabiCasta uses fair randomness to help you choose when you are stuck. It does not claim that any particular result reveals God’s specific will for your life. Use it thoughtfully, alongside prayer, counsel, and wisdom.",
    verse: null,
  },
];
