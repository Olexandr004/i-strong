export function getDaysNaming(daysAmount: number) {
  const cases = [2, 1, 5] // Кількість закінчень для відмінкових відмінків (однина, множина (2-5), множина (6+))

  const endingIndex =
    daysAmount % 100 > 10 && daysAmount % 100 < 20
      ? 1
      : cases[Math.floor(Math.log10(daysAmount) % 3)]
  const words = ['день', 'дні', 'днів']

  return `${words[endingIndex]} ${daysAmount}`
}
