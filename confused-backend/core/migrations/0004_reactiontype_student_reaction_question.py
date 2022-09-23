# Generated by Django 4.0.4 on 2022-09-15 13:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20220914_0733'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReactionType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reaction_description', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('display_name', models.CharField(max_length=120)),
                ('reaction_type_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.reactiontype')),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.session')),
            ],
        ),
        migrations.CreateModel(
            name='Reaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reaction_type_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.reactiontype')),
                ('student_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.student')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vote_count', models.IntegerField()),
                ('question_content', models.CharField(max_length=255)),
                ('student_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.student')),
            ],
        ),
    ]
