DROP TABLE users;
DROP TABLE aliments;
DROP TABLE repas;
DROP TABLE compo_repas;
DROP TABLE auth;
DROP TABLE tokens;
DROP TABLE allergens;
DROP TABLE aliment_allergen;



CREATE TABLE users(id SERIAL PRIMARY KEY, prenom VARCHAR(40), nom VARCHAR(40), naissance DATE);
CREATE TABLE aliments(id SERIAL PRIMARY KEY, nom VARCHAR(40));
CREATE TABLE repas(id SERIAL PRIMARY KEY, user_id INT, time TIMESTAMP);
CREATE TABLE compo_repas(id SERIAL PRIMARY KEY, alim_id INT, repas_id INT, qte INT);
CREATE TABLE auth(id SERIAL PRIMARY KEY, user_id INT, username VARCHAR(40) UNIQUE, password VARCHAR(40));
CREATE TABLE tokens(id SERIAL PRIMARY KEY, username VARCHAR(40) UNIQUE, token VARCHAR, max_time TIMESTAMP);
CREATE TABLE allergens(id SERIAL PRIMARY KEY, nom VARCHAR(40));
CREATE TABLE aliment_allergen(id SERIAL PRIMARY KEY, alim_id INT, allerg_id INT);



INSERT INTO users(prenom, nom, naissance) VALUES('Mehdi', 'Douch', '01-12-1992');

INSERT INTO aliments(nom) VALUES('fromage');
INSERT INTO aliments(nom) VALUES('pain');
INSERT INTO aliments(nom) VALUES('pruneaux');
INSERT INTO aliments(nom) VALUES('cheesecake');


INSERT INTO repas(user_id, time) VALUES('1', '05-03-2017 14:36:00');
INSERT INTO repas(user_id, time) VALUES('1', '05-03-2017 19:00:00');


INSERT INTO compo_repas(alim_id, repas_id, qte) VALUES('4', '1', 100);
INSERT INTO compo_repas(alim_id, repas_id, qte) VALUES('1', '2', 50);
INSERT INTO compo_repas(alim_id, repas_id, qte) VALUES('2', '2', 70);

INSERT INTO auth(user_id, username, password) VALUES('1', 'mehdi', 'douch');

INSERT INTO tokens(username, token, max_time) VALUES('mehdi', 'oulala', now());

INSERT INTO allergens(nom) VALUES('gluten');
INSERT INTO allergens(nom) VALUES('lactose');
INSERT INTO allergens(nom) VALUES('oligosaccharides');


INSERT INTO aliment_allergen(alim_id, allerg_id) values('1', '2');
INSERT INTO aliment_allergen(alim_id, allerg_id) values('2', '1');
INSERT INTO aliment_allergen(alim_id, allerg_id) values('4', '1');
INSERT INTO aliment_allergen(alim_id, allerg_id) values('4', '2');
INSERT INTO aliment_allergen(alim_id, allerg_id) values('3', '3');

SELECT aliments.nom as aliment, allergens.nom as allergen
FROM allergens, aliments, aliment_allergen 
WHERE allergens.id = aliment_allergen.allerg_id
AND aliments.id = aliment_allergen.alim_id;

SELECT users.nom as nom, users.prenom, aliments.nom as aliment, compo_repas.qte, to_char(repas.time, 'DD Mon YYYY HH24:MM') as time 
          FROM users, aliments, repas, compo_repas
          WHERE aliments.id = compo_repas.alim_id
          AND repas.id = compo_repas.repas_id 
          AND users.id = repas.user_id 
          AND user_id='1';