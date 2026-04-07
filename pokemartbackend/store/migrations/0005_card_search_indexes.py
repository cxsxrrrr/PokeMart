from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0004_alter_orders_status_message"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="card",
            index=models.Index(fields=["name"], name="store_card_name_idx"),
        ),
        migrations.AddIndex(
            model_name="card",
            index=models.Index(fields=["name", "id"], name="store_card_name_id_idx"),
        ),
    ]
