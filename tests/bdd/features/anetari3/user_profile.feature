Feature: Validimi i Profilit të Përdoruesit
  Si përdorues i sistemit
  Unë dua të kem validim për profilin tim
  Në mënyrë që të menaxhoj informacionin personal

  Background:
    Given Jam i kyçur si përdorues
    And Jam në faqen e profilit tim

  Scenario: Shikimi i informacionit të profilit
    When Unë shoh profilin tim
    Then Duhet të shoh emrin tim
    And Duhet të shoh email-in tim
    And Duhet të shoh datën e regjistrimit

  Scenario: Përditësimi i informacionit të profilit
    When Unë ndryshoj emrin tim të plotë
    And Unë ndryshoj adresën time
    And Unë ruaj ndryshimet
    Then Informacioni duhet të përditësohet
    And Adresa duhet të përditësohet
    And Duhet të shoh një mesazh konfirmimi
