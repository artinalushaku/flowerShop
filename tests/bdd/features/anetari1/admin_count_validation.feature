Feature: Validimi i Numrit të Administratorëve
  Si pronar i sistemit
  Unë dua të kufizoj numrin e administratorëve
  Në mënyrë që të mbaj kontroll të duhur të qasjes

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të përdoruesve

  Scenario: Shikimi i numrit aktual të administratorëve
    When Unë shoh listën e administratorëve
    Then Duhet të shoh numrin aktual të administratorëve
    And Duhet të shoh numrin maksimal të lejuar të administratorëve (10)

  Scenario: Promovimi i një përdoruesi në administrator kur jemi nën limit
    Given Aktualisht janë 8 administratorë në sistem
    When Unë promovoj një përdorues të rregullt në rolin e administratorit
    Then Roli i përdoruesit duhet të ndryshojë në administrator
    And Sistemi duhet të tregojë 9 administratorë 