document.getElementById("header-container").innerHTML = `
<div class="header">
  <div class="header-left">
    <div class="logo">
      <img src="/images/logo.png">
      <span>DO‘PPI AI</span>
    </div>

    <a href="/explore/" class="nav-btn">Explore</a>
    <a href="/generate/" class="nav-btn">Generate</a>
    <a href="/dashboard/" class="nav-btn">Dashboard</a>
    <a href="/history/" class="nav-btn">History</a>
    <a href="/support/" class="nav-btn">Support</a>
    <a href="/subscription/" class="nav-btn">Subscription</a>
  </div>

  <div class="header-right">
    <div class="coin-box">
      🪙 <span id="coinAmount">120</span>
    </div>

    <div class="user-box">
      <div class="user-avatar" id="userAvatar">👤</div>
      <div class="user-menu" id="userMenu">
        <p id="headerUserName">Xush kelibsiz</p>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  </div>
</div>
`;
