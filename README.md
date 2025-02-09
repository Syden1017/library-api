db.books.insertMany([
{
title: "Война и мир",
description: "Роман о жизни русского общества во время наполеоновских войн.",
authors: "Лев Толстой"
},
{
title: "1984",
description: "Дистопический роман о тоталитарном обществе.",
authors: "Джордж Оруэлл"
}
]);

db.books.find({ title: "1984" }, { title: 1, description: 1, authors: 1 });

db.books.updateOne(
{ id: ObjectId(1) },
{
$set: {
description: "Обновленное описание книги.",
authors: "Обновленные авторы"
}
}
);
