// Która karta Filmu jest „wskazana” kursorem, czyli na której pokazujemy Przycisk pobierania.
// Podgląd wideo YouTube to warstwa poza kartą: gdy się pojawia, karta traci :hover, choć kursor
// stoi w miejscu. Dlatego liczymy to sami z warstw pod kursorem (document.elementsFromPoint).

export type PodKursorem<K> = {
  /** Karty Filmów, których elementy leżą pod kursorem (także pod przykrywającym je podglądem). */
  karty: readonly K[];
  /** ID Filmu z aktywnego podglądu wideo pod kursorem; null, gdy kursor nie jest nad podglądem. */
  idPodgladu: string | null;
};

export function wskazanaKarta<K>(
  pod: PodKursorem<K>,
  poprzednia: K | undefined,
  idKarty: (karta: K) => string | null | undefined,
): K | undefined {
  // Podgląd leży na wierzchu i jest ok. 12 px większy od Miniaturki, więc jego brzeg potrafi
  // zachodzić na sąsiednią kartę. Wtedy wygrywa karta, do której należy podgląd (to samo ID Filmu).
  if (pod.idPodgladu !== null) {
    const doPodgladu = pod.karty.find((karta) => idKarty(karta) === pod.idPodgladu);
    if (doPodgladu !== undefined) return doPodgladu;
    if (poprzednia !== undefined && idKarty(poprzednia) === pod.idPodgladu) return poprzednia;
  }
  return pod.karty[0];
}

/**
 * Czy otworzyć warstwę listy, w której leży wskazana karta. Wyniki wyszukiwania (ytd-search)
 * zamykają swoją warstwę (z-index: 0), więc przycisk nie wyjdzie ponad podgląd wideo leżący poza
 * nimi. Otwieramy ją tylko na czas wskazania karty: w środku są dymki i strzałki z wysokim z-index.
 */
export function otworzycWarstweListy<K>(
  wskazana: K | undefined,
  wZamknietejWarstwie: (karta: K) => boolean,
): boolean {
  return wskazana !== undefined && wZamknietejWarstwie(wskazana);
}
