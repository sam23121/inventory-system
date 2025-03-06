"""serial_number_to_documents

Revision ID: aeb1b0643564
Revises: 5a7903aa31a6
Create Date: 2025-03-06 19:38:08.525268

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aeb1b0643564'
down_revision: Union[str, None] = '5a7903aa31a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('baptism_documents', sa.Column('serial_number', sa.String(), nullable=False))
    op.create_index(op.f('ix_baptism_documents_serial_number'), 'baptism_documents', ['serial_number'], unique=True)
    op.add_column('burial_documents', sa.Column('serial_number', sa.String(), nullable=False))
    op.create_index(op.f('ix_burial_documents_serial_number'), 'burial_documents', ['serial_number'], unique=True)
    op.add_column('marriage_documents', sa.Column('serial_number', sa.String(), nullable=False))
    op.create_index(op.f('ix_marriage_documents_serial_number'), 'marriage_documents', ['serial_number'], unique=True)
    op.add_column('membership_documents', sa.Column('serial_number', sa.String(), nullable=False))
    op.create_index(op.f('ix_membership_documents_serial_number'), 'membership_documents', ['serial_number'], unique=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_membership_documents_serial_number'), table_name='membership_documents')
    op.drop_column('membership_documents', 'serial_number')
    op.drop_index(op.f('ix_marriage_documents_serial_number'), table_name='marriage_documents')
    op.drop_column('marriage_documents', 'serial_number')
    op.drop_index(op.f('ix_burial_documents_serial_number'), table_name='burial_documents')
    op.drop_column('burial_documents', 'serial_number')
    op.drop_index(op.f('ix_baptism_documents_serial_number'), table_name='baptism_documents')
    op.drop_column('baptism_documents', 'serial_number')
    # ### end Alembic commands ###
