Feature: Validimi i Numrit të Administratorëve
  Si administrator i sistemit
  Unë dua të shoh numrin e administratorëve
  Në mënyrë që të di sa administratorë ka sistemi

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të përdoruesve


  Scenario: Promovimi i një përdoruesi në administrator
    Given Unë shoh listën e përdoruesve
    When Unë zgjedh përdoruesin me email "user@example.com"
    And Unë klikoj butonin "Promovo në Admin"
    Then Përdoruesi duhet të promovohet në administrator
    And Duhet të shfaqet mesazhi i suksesit