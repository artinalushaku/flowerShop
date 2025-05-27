Feature: Validimi i Produktit
  Si administrator i dyqanit
  Unë dua të kem validim për detajet e produktit
  Në mënyrë që të siguroj cilësinë dhe konsistencën e të dhënave

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shtimi i një produkti me përshkrim të vlefshëm
    When Unë fut një përshkrim produkti me 25 karaktere
    Then Forma duhet të pranojë përshkrimin
    And Nuk duhet të shoh gabime validimi

  Scenario: Shtimi i një produkti me përshkrim shumë të shkurtër
    When Unë fut një përshkrim produkti me 15 karaktere
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon minimum 20 karaktere të kërkuara 