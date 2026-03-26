export type CrisisResource = {
  name: string;
  phone: string | null;
  description: string;
};

export const CRISIS_PHRASES = [
  "kill myself",
  "want to die",
  "suicide",
  "suicidal",
  "end my life",
  "end it all",
  "don't want to live",
  "dont want to live",
  "no reason to live",
  "rather be dead",
  "better off dead",
  "wish i was dead",
  "wish i were dead",
  "take my own life",
  "thinking about ending",
  "planning to end",
  "going to end it",
  "hurt myself",
  "self harm",
  "self-harm",
  "cutting myself",
  "harming myself",
  "being abused",
  "being beaten",
  "domestic violence",
  "partner is hurting me",
  "husband is hitting",
  "wife is hitting",
  "someone is hurting me",
  "afraid for my life",
  "he hit me",
  "she hit me",
  "threatened to kill",
  "give up on life",
  "can't go on",
  "cant go on",
  "no way out",
  "i can't take it anymore",
  "i cant take it anymore",
  "nobody cares",
  "no one cares",
  "what's the point",
  "whats the point",
  "child abuse",
  "hurting my child",
  "hurting a child",
] as const;

export const CRISIS_RESPONSE = {
  crisis: true,
  summary:
    "If you're in crisis or having thoughts of suicide, please reach out — you're not alone. Help is available right now.",
  resources: [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "Call or text 988, available 24/7",
    },
    {
      name: "Crisis Text Line",
      phone: null,
      description: "Text HOME to 741741",
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "24/7 confidential support",
    },
    {
      name: "Emergency Services",
      phone: "911",
      description: "If you are in immediate danger",
    },
  ] satisfies CrisisResource[],
} as const;

export function detectCrisis(query: string): boolean {
  const lower = query.toLowerCase();
  return CRISIS_PHRASES.some((phrase) => lower.includes(phrase));
}
