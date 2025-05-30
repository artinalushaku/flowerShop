Feature: Validimi i Mesazhit në Formën e Kontaktit
  Si vizitor i faqes
  Unë dua të kem validim për mesazhin në formën e kontaktit
  Në mënyrë që të dërgoj mesazhe të kuptueshme

  Background:
    Given Jam në faqen e kontaktit

  Scenario: Dërgimi i një forme kontakti me mesazh të vlefshëm
    When Unë fut një mesazh me 100 karaktere
    Then Forma duhet të pranojë mesazhin
    And Nuk duhet të shoh gabime validimi

  Scenario: Dërgimi i një forme kontakti me mesazh shumë të shkurtër
    When Unë fut një mesazh me 10 karaktere
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon minimum 50 karaktere të kërkuara

  Scenario: Dërgimi i një forme kontakti me mesazh shumë të gjatë
    Given Jam në faqen e kontaktit
    When Unë fut një mesazh me 501 karaktere
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon maksimum 500 karaktere të lejuara 