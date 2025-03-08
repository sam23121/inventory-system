"""add profile picture

Revision ID: c415c46de0c7
Revises: 4415c46de0c6
Create Date: 2025-02-24 16:30:36.434377

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision: str = 'c415c46de0c7'
down_revision: Union[str, None] = '4415c46de0c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('users', sa.Column('profile_picture', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'profile_picture')
