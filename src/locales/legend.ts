const phrases: Record<string, readonly [string, string, string]> = {
  "A single worldwide claim. Requires at least 70,000 XP. First eligible learner to claim it wins.": [
    "Nur einmal weltweit. Mindestens 70.000 XP. Wer berechtigt ist und zuerst zugreift, erhält es.",
    "Один предмет на весь мир. Нужно минимум 70 000 XP. Получит первый подходящий ученик, который заберёт награду.",
    "Әлемде жалғыз зат. Кемінде 70 000 XP керек. Шартқа сай болып, бірінші алған оқушыға беріледі.",
  ],
  "Unknown reward": ["Unbekannte Belohnung", "Награда «Неизвестность»", "«Белгісіз» марапаты"],
  "World legend": ["Weltlegende", "Легенда мира", "Әлем аңызы"],
  "Your Sparks": ["Deine Funken", "Твои искры", "Сенің ұшқындарың"],
  "A one-of-one learner": ["Ein einzigartiger Lernender", "Неповторимый ученик", "Қайталанбас оқушы"],
  "Preview Unknown reward": ["Unbekannte Belohnung ansehen", "Предпросмотр награды «Неизвестность»", "«Белгісіз» марапатын алдын ала қарау"],
  "Temporary ownership in this sandbox only.": [
    "Nur vorübergehender Besitz in dieser Sandbox.",
    "Временное владение только в этой тестовой среде.",
    "Тек осы сынақ ортасындағы уақытша иелік.",
  ],
  "Complete the sentence.": ["Vervollständige den Satz.", "Дополни предложение.", "Сөйлемді толықтыр."],
};
export const legendPhrases = Object.fromEntries(Object.entries(phrases).map(([key, value]) => [key, [key, ...value]]));
