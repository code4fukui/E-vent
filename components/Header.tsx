export default function Header() {
  return (
    <header class="max-w-screen-md mx-auto my-4 flex items-center justify-center">
      <a href="/">
        <h1 class="text-4xl font-bold">E-vent</h1>
      </a>
      <nav class="ml-auto">
        <ul class="flex items-center">
          <li class="mr-3">
            <a
              href="/application"
              class="hover:text-orange-500 hover:underline font-bold"
            >
              イベントを開催する
            </a>
          </li>
          <li>
            <a
              href="/permit"
              class="hover:text-orange-500 hover:underline font-bold"
            >
              （自治体用）
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
